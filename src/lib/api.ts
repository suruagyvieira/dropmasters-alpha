export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    // Se estiver no servidor e a URL for relativa (começa com /), precisamos da URL base completa
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

    if (typeof window === 'undefined' && !baseUrl) {
        baseUrl = 'http://localhost:3000';
    }

    // Melhoria de Performance: Retry dinâmico para lidar com "Cold Starts" do Render Free
    const maxRetries = 3;
    let delay = 1000;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (!response.ok) {
                // Se for erro de servidor, tentamos novamente
                if (response.status >= 500 && i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                    continue;
                }
                throw new Error(`API error: ${response.statusText}`);
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            }
            return null;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
}
