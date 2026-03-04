export async function handleWatermarkText(client, args) {
    const body = {
        image_url: args.image_url,
        text: args.text,
    };
    if (args.size !== undefined)
        body.size = args.size;
    if (args.color !== undefined)
        body.color = args.color;
    if (args.opacity !== undefined)
        body.opacity = args.opacity;
    if (args.angle !== undefined)
        body.angle = args.angle;
    if (args.position !== undefined)
        body.position = args.position;
    if (args.tile !== undefined)
        body.tile = args.tile;
    if (args.font !== undefined)
        body.font = args.font;
    const result = (await client.postJson("/watermark/text", body));
    return (`Watermarked image ready.\n` +
        `Download URL: ${result.download_url}\n` +
        `Filename: ${result.filename}\n` +
        `Expires: ${result.expires_at}`);
}
//# sourceMappingURL=watermark-text.js.map