/**
 * ═══════════════════════════════════════════════════════════════
 * API CLIENT v9.0 - "NEURAL FETCH"
 * ═══════════════════════════════════════════════════════════════
 * [ZERO COST] | [AUTO RETRY] | [TIMEOUT PROTECTION]
 * ═══════════════════════════════════════════════════════════════
 */

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

export async function fetchApi<T = any>(
    endpoint: string,
    options: RequestInit = {},
    timeout: number = DEFAULT_TIMEOUT
): Promise<T> {
    // Environment-aware URL resolution
    const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL;
    let baseUrl = '';

    if (typeof window === 'undefined') {
        // Server-side: Prefer explicit API URL, then fallback to Vercel discovery
        baseUrl = PUBLIC_API || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    } else {
        // Client-side: Prefer explicit API URL, otherwise same-origin
        baseUrl = PUBLIC_API || '';
    }

    let delay = 500;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        // Timeout via AbortController (Performance Protection)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                // Retry on server errors (5xx)
                if (response.status >= 500 && attempt < MAX_RETRIES - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                    continue;
                }
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                return response.json();
            }
            return null as T;

        } catch (error: any) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                console.warn(`[API] Request timeout: ${endpoint}`);
            }

            if (attempt === MAX_RETRIES - 1) {
                throw error;
            }

            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }

    throw new Error(`[API] Failed after ${MAX_RETRIES} attempts`);
}
