# markly-mcp-server

MCP (Model Context Protocol) server for [Markly.cloud](https://www.markly.cloud) - add watermarks to images via AI agents.

## Tools

| Tool | Description |
|------|-------------|
| `markly_watermark_text` | Add a text watermark to an image via URL |
| `markly_watermark_logo` | Add a logo watermark to an image via URL |
| `markly_batch_watermark` | Watermark up to 20 images, get a ZIP |
| `markly_check_usage` | Check API quota and usage stats |

## Setup

### 1. Get an API key

Go to [markly.cloud](https://www.markly.cloud) or generate one via CLI:

```bash
php artisan api:token:create "My Agent" --plan=free
```

### 2. Configure in Claude Code

Add to your Claude Code settings (`~/.claude/settings.json`):

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

### 3. Use it

Ask your AI agent to watermark an image:

> "Add 'Copyright 2026' as a watermark to this image: https://example.com/photo.jpg"

## Environment variables

| Variable | Required | Default |
|----------|----------|---------|
| `MARKLY_API_KEY` | Yes | - |
| `MARKLY_API_URL` | No | `https://www.markly.cloud/api/v1` |

## Plans

| Plan | Rate limit | Daily limit | Branded watermark |
|------|-----------|-------------|-------------------|
| Free | 10/min | 100/day | Yes ("markly.cloud") |
| Pro | 60/min | 1,000/day | No |
| Business | 120/min | 5,000/day | No |

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
