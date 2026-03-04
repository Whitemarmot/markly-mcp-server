export async function handleBatchWatermark(client, args) {
    const imageUrls = args.image_urls;
    if (!imageUrls || imageUrls.length === 0) {
        throw new Error("At least one image URL is required.");
    }
    if (imageUrls.length > 20) {
        throw new Error("Maximum 20 images per batch.");
    }
    // Step 1: Upload all images
    let batchId = null;
    const uploadedIds = [];
    for (const url of imageUrls) {
        const body = { image_url: url };
        if (batchId)
            body.batch_id = batchId;
        const result = (await client.postJson("/batch/upload", body));
        batchId = result.batch_id;
        uploadedIds.push(result.image_id);
    }
    // Step 2: Start processing
    const startBody = {
        batch_id: batchId,
        mode: "text",
        text: args.text,
    };
    if (args.size !== undefined)
        startBody.size = args.size;
    if (args.color !== undefined)
        startBody.color = args.color;
    if (args.opacity !== undefined)
        startBody.opacity = args.opacity;
    if (args.position !== undefined)
        startBody.position = args.position;
    if (args.tile !== undefined)
        startBody.tile = args.tile;
    await client.postJson("/batch/start", startBody);
    // Step 3: Poll for completion
    const maxWait = 120_000; // 2 minutes
    const pollInterval = 2_000; // 2 seconds
    const startTime = Date.now();
    while (Date.now() - startTime < maxWait) {
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        const status = (await client.get(`/batch/${batchId}/status`));
        if (status.status === "done" && status.download_url) {
            return (`Batch complete! ${status.processed - status.failed}/${status.total} images watermarked.\n` +
                (status.failed > 0 ? `${status.failed} failed.\n` : "") +
                `Download ZIP: ${status.download_url}`);
        }
        if (status.status === "error") {
            throw new Error("Batch processing failed.");
        }
    }
    throw new Error("Batch processing timed out after 2 minutes. " +
        `Check status at: GET /api/v1/batch/${batchId}/status`);
}
//# sourceMappingURL=batch.js.map