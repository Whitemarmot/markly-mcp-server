import { MarklyClient } from "../client.js";

export async function handleBatchWatermark(
  client: MarklyClient,
  args: Record<string, unknown>
): Promise<string> {
  const imageUrls = args.image_urls as string[];

  if (!imageUrls || imageUrls.length === 0) {
    throw new Error("At least one image URL is required.");
  }

  if (imageUrls.length > 20) {
    throw new Error("Maximum 20 images per batch.");
  }

  // Step 1: Upload all images
  let batchId: string | null = null;
  const uploadedIds: string[] = [];

  for (const url of imageUrls) {
    const body: Record<string, unknown> = { image_url: url };
    if (batchId) body.batch_id = batchId;

    const result = (await client.postJson("/batch/upload", body)) as {
      batch_id: string;
      image_id: string;
    };

    batchId = result.batch_id;
    uploadedIds.push(result.image_id);
  }

  // Step 2: Start processing
  const startBody: Record<string, unknown> = {
    batch_id: batchId,
    mode: "text",
    text: args.text,
  };
  if (args.size !== undefined) startBody.size = args.size;
  if (args.color !== undefined) startBody.color = args.color;
  if (args.opacity !== undefined) startBody.opacity = args.opacity;
  if (args.position !== undefined) startBody.position = args.position;
  if (args.tile !== undefined) startBody.tile = args.tile;

  await client.postJson("/batch/start", startBody);

  // Step 3: Poll for completion
  const maxWait = 120_000; // 2 minutes
  const pollInterval = 2_000; // 2 seconds
  const startTime = Date.now();

  while (Date.now() - startTime < maxWait) {
    await new Promise((resolve) => setTimeout(resolve, pollInterval));

    const status = (await client.get(`/batch/${batchId}/status`)) as {
      status: string;
      processed: number;
      total: number;
      failed: number;
      download_url: string | null;
    };

    if (status.status === "done" && status.download_url) {
      return (
        `Batch complete! ${status.processed - status.failed}/${status.total} images watermarked.\n` +
        (status.failed > 0 ? `${status.failed} failed.\n` : "") +
        `Download ZIP: ${status.download_url}`
      );
    }

    if (status.status === "error") {
      throw new Error("Batch processing failed.");
    }
  }

  throw new Error(
    "Batch processing timed out after 2 minutes. " +
      `Check status at: GET /api/v1/batch/${batchId}/status`
  );
}
