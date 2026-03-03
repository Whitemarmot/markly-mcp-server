/**
 * HTTP client wrapper for the Markly API v1.
 */

const DEFAULT_API_URL = "https://www.markly.cloud/api/v1";

export class MarklyClient {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.MARKLY_API_KEY || "";
    this.apiUrl = (process.env.MARKLY_API_URL || DEFAULT_API_URL).replace(
      /\/$/,
      ""
    );

    if (!this.apiKey) {
      throw new Error(
        "MARKLY_API_KEY environment variable is required. " +
          "Generate one with: php artisan api:token:create 'MCP Server'"
      );
    }
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: "application/json",
      "User-Agent": "MarklyMCP/1.0",
    };
  }

  async postJson(
    endpoint: string,
    body: Record<string, unknown>
  ): Promise<unknown> {
    const res = await fetch(`${this.apiUrl}${endpoint}`, {
      method: "POST",
      headers: {
        ...this.headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        `API error ${res.status}: ${(data as Record<string, string>).error || JSON.stringify(data)}`
      );
    }
    return data;
  }

  async postForm(
    endpoint: string,
    formData: FormData
  ): Promise<unknown> {
    const res = await fetch(`${this.apiUrl}${endpoint}`, {
      method: "POST",
      headers: this.headers(),
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        `API error ${res.status}: ${(data as Record<string, string>).error || JSON.stringify(data)}`
      );
    }
    return data;
  }

  async get(endpoint: string): Promise<unknown> {
    const res = await fetch(`${this.apiUrl}${endpoint}`, {
      method: "GET",
      headers: this.headers(),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        `API error ${res.status}: ${(data as Record<string, string>).error || JSON.stringify(data)}`
      );
    }
    return data;
  }

  async delete(
    endpoint: string,
    body: Record<string, unknown>
  ): Promise<unknown> {
    const res = await fetch(`${this.apiUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        ...this.headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        `API error ${res.status}: ${(data as Record<string, string>).error || JSON.stringify(data)}`
      );
    }
    return data;
  }
}
