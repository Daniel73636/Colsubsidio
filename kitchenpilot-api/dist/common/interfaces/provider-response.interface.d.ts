export interface ProviderResponse {
    success: boolean;
    provider: string;
    data: unknown;
    error?: string;
}
