export const apiClient = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const base = (import.meta.env.VITE_API_BASE_URL as string) ?? "";

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };

  const response = await fetch(`${base}/${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`API Error: ${response.status} ${response.statusText} ${text}`);
  }

  return response.json();
};