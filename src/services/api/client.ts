
export async function apiClient({
    endpoint,
    method = "GET",
    body,
    headers = {},
}: {
    endpoint: string;
    method?: string;
    body?: any;
    headers?: Record<string, string>;
}) {
    const token = localStorage.getItem("token");

    const base = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
    const response = await fetch(`${base}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "API Error");
    }

    return response.json();
}  