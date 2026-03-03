import { MarklyClient } from "../client.js";

export async function handleUsage(client: MarklyClient): Promise<string> {
  const result = (await client.get("/usage")) as {
    plan: string;
    name: string;
    requests_today: number;
    daily_limit: number;
    rate_per_minute: number;
    requests_total: number;
    images_processed: number;
    branded_watermark: boolean;
  };

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
