# markly-mcp-server

MCP (Model Context Protocol) server for [Markly.cloud](https://www.markly.cloud) - add watermarks to images via AI agents.

Works out of the box without an API key (free tier with branding). Add an API key to remove branding and increase limits.

## Tools

| Tool | Description |
|------|-------------|
| `markly_watermark_text` | Add a text watermark to an image via URL |
| `markly_watermark_logo` | Add a logo watermark to an image via URL |
| `markly_batch_watermark` | Watermark up to 20 images, get a ZIP |
| `markly_check_usage` | Check API quota and usage stats (requires API key) |

## Quick start (no API key needed)

Add to your Claude Desktop config or Claude Code settings:

```json
{
  "mcpServers": {
    "markly": {
      "command": "npx",
      "args": ["-y", "markly-mcp-server"]
    }
  }
}
```

That's it. Ask your AI agent:

> "Add 'Copyright 2026' as a watermark to this image: https://example.com/photo.jpg"

## With an API key (optional)

Get an API key at [markly.cloud/developers](https://www.markly.cloud/developers) to remove the "markly.cloud" branding and get higher rate limits.

```json
{
  "mcpServers": {
    "markly": {
      "command": "npx",
      "args": ["-y", "markly-mcp-server"],
      "env": {
        "MARKLY_API_KEY": "mkly_your_token_here"
      }
    }
  }
}
```

## Environment variables

| Variable | Required | Default |
|----------|----------|---------|
| `MARKLY_API_KEY` | No | - (anonymous free tier) |
| `MARKLY_API_URL` | No | `https://www.markly.cloud/api/v1` |

## Plans

| Plan | Rate limit | Daily limit | Branded watermark |
|------|-----------|-------------|-------------------|
| Anonymous | 5/min | 50/day | Yes ("markly.cloud") |
| Credit | 60/min | 1,000/day | No (while credits last) |
| Pro | 60/min | 1,000/day | No |
| Business | 120/min | 5,000/day | No |

Buy credits at [markly.cloud/developers](https://www.markly.cloud/developers) - starting at 250 credits for 5 EUR.

## License

MIT


---

<p align="center">
  <a href="https://www.copyright01.com/certificat/020DC4B654698B93E61ECAD7031B5979">
    <img src="https://www.copyright01.com/badge/020DC4B654698B93E61ECAD7031B5979.svg" alt="Protected by Copyright01" />
  </a>
  <br>
  <sub>Protected by <a href="https://www.copyright01.com">Copyright01</a> - Ref: CR-2026-33771 - Certified 2026-03-03</sub>
</p>
