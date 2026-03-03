/**
 * HTTP client wrapper for the Markly API v1.
 */
export declare class MarklyClient {
    private apiUrl;
    private apiKey;
    constructor();
    private headers;
    postJson(endpoint: string, body: Record<string, unknown>): Promise<unknown>;
    postForm(endpoint: string, formData: FormData): Promise<unknown>;
    get(endpoint: string): Promise<unknown>;
    delete(endpoint: string, body: Record<string, unknown>): Promise<unknown>;
}
