export async function handleUsage(client) {
    const result = (await client.get("/usage"));
    const lines = [
        `Plan: ${result.plan}`,
        `Token: ${result.name}`,
        `Requests today: ${result.requests_today} / ${result.daily_limit}`,
        `Rate limit: ${result.rate_per_minute} req/min`,
        `Total requests: ${result.requests_total}`,
        `Images processed: ${result.images_processed}`,
        `Branded watermark: ${result.branded_watermark ? "yes (free tier)" : "no"}`,
    ];
    return lines.join("\n");
}
//# sourceMappingURL=usage.js.map