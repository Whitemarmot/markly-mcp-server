export async function handleWatermarkLogo(client, args) {
    const body = {
        image_url: args.image_url,
        logo_url: args.logo_url,
    };
    if (args.position !== undefined)
        body.position = args.position;
    if (args.opacity !== undefined)
        body.opacity = args.opacity;
    if (args.scale !== undefined)
        body.scale = args.scale;
    const result = (await client.postJson("/watermark/logo", body));
    return (`Watermarked image ready.\n` +
        `Download URL: ${result.download_url}\n` +
        `Filename: ${result.filename}\n` +
        `Expires: ${result.expires_at}`);
}
//# sourceMappingURL=watermark-logo.js.map