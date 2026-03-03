#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { MarklyClient } from "./client.js";
import { handleWatermarkText } from "./tools/watermark-text.js";
import { handleWatermarkLogo } from "./tools/watermark-logo.js";
import { handleBatchWatermark } from "./tools/batch.js";
import { handleUsage } from "./tools/usage.js";

const server = new McpServer({
  name: "markly",
  version: "1.0.0",
});

let client: MarklyClient;

try {
  client = new MarklyClient();
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}

// Tool: markly_watermark_text
server.tool(
  "markly_watermark_text",
  "Add a text watermark to an image. Provide an image URL and watermark text. Returns a download URL (valid 30 min).",
  {
    image_url: z.string().describe("URL of the image to watermark (must be publicly accessible)"),
    text: z.string().describe("Watermark text (max 200 characters)"),
    size: z.number().optional().describe("Font size in pixels (12-200, default 48)"),
    color: z.string().optional().describe("Hex color (e.g. #ffffff, default white)"),
    opacity: z.number().optional().describe("Opacity percentage (5-100, default 50)"),
    angle: z.number().optional().describe("Rotation angle in degrees (-180 to 180, default -30)"),
    position: z
      .enum([
        "top-left", "top", "top-right",
        "left", "center", "right",
        "bottom-left", "bottom", "bottom-right",
      ])
      .optional()
      .describe("Watermark position (default center)"),
    tile: z.boolean().optional().describe("Tile the watermark across the entire image (default false)"),
    font: z
      .enum(["inter", "roboto", "playfair", "courier", "arial"])
      .optional()
      .describe("Font (default inter)"),
  },
  async (args) => {
    try {
      const text = await handleWatermarkText(client, args);
      return { content: [{ type: "text", text }] };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error: ${(err as Error).message}` }],
        isError: true,
      };
    }
  }
);

// Tool: markly_watermark_logo
server.tool(
  "markly_watermark_logo",
  "Add a logo/image watermark to an image. Provide image and logo URLs. Returns a download URL (valid 30 min).",
  {
    image_url: z.string().describe("URL of the image to watermark"),
    logo_url: z.string().describe("URL of the logo to use as watermark (PNG or WebP recommended)"),
    position: z
      .enum([
        "top-left", "top", "top-right",
        "left", "center", "right",
        "bottom-left", "bottom", "bottom-right",
      ])
      .optional()
      .describe("Logo position (default center)"),
    opacity: z.number().optional().describe("Opacity percentage (5-100, default 50)"),
    scale: z.number().optional().describe("Logo scale as % of image width (5-80, default 20)"),
  },
  async (args) => {
    try {
      const text = await handleWatermarkLogo(client, args);
      return { content: [{ type: "text", text }] };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error: ${(err as Error).message}` }],
        isError: true,
      };
    }
  }
);

// Tool: markly_batch_watermark
server.tool(
  "markly_batch_watermark",
  "Watermark multiple images at once. Upload image URLs, apply text watermark, get a ZIP. Supports up to 20 images.",
  {
    image_urls: z.array(z.string()).describe("Array of image URLs to watermark (max 20)"),
    text: z.string().describe("Watermark text to apply to all images"),
    size: z.number().optional().describe("Font size in pixels (12-200, default 48)"),
    color: z.string().optional().describe("Hex color (e.g. #ffffff)"),
    opacity: z.number().optional().describe("Opacity percentage (5-100, default 50)"),
    position: z
      .enum([
        "top-left", "top", "top-right",
        "left", "center", "right",
        "bottom-left", "bottom", "bottom-right",
      ])
      .optional()
      .describe("Watermark position"),
    tile: z.boolean().optional().describe("Tile watermark across all images"),
  },
  async (args) => {
    try {
      const text = await handleBatchWatermark(client, args);
      return { content: [{ type: "text", text }] };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error: ${(err as Error).message}` }],
        isError: true,
      };
    }
  }
);

// Tool: markly_check_usage
server.tool(
  "markly_check_usage",
  "Check your Markly API usage and quota. Shows plan, daily requests, limits, and total images processed.",
  {},
  async () => {
    try {
      const text = await handleUsage(client);
      return { content: [{ type: "text", text }] };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error: ${(err as Error).message}` }],
        isError: true,
      };
    }
  }
);

// Start server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
