// src/services/api/client.ts
import { useAuthStore } from "@/store/use-auth-store/use-auth-store";

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(newToken: string) {
  refreshQueue.forEach((resolve) => resolve(newToken));
  refreshQueue = [];
}

export async function apiClient<TResponse, TBody = unknown>({
  endpoint,
  method = "GET",
  body,
  headers = {},
  _retry = false, // internal flag to prevent infinite loops
}: {
  endpoint: string;
  method?: string;
  body?: TBody;
  headers?: Record<string, string>;
  _retry?: boolean;
}): Promise<TResponse> {
  const base = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(`${base}${endpoint}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // ── 401 handling with refresh + retry ──────────────────────────────────
  if (res.status === 401 && !_retry) {
    // Don't try to refresh if this IS the refresh call (avoid infinite loop)
    if (endpoint === "/auth/refresh" || endpoint === "/auth/login") {
      throw new ApiError("Unauthorized", 401);
    }

    // If already refreshing, queue this request to retry when done
    if (isRefreshing) {
      return new Promise<TResponse>((resolve, reject) => {
        refreshQueue.push((newToken: string) => {
          apiClient<TResponse, TBody>({
            endpoint,
            method,
            body,
            headers: { ...headers, Authorization: `Bearer ${newToken}` },
            _retry: true,
          })
            .then(resolve)
            .catch(reject);
        });
      });
    }

    isRefreshing = true;

    try {
      const storedRefreshToken = useAuthStore.getState().refreshToken;

      if (!storedRefreshToken) throw new Error("No refresh token available");

      const refreshRes = await fetch(`${base}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!refreshRes.ok) throw new Error("Refresh failed");

      const refreshData = await refreshRes.json();
      const newToken: string = refreshData.accessToken;

      useAuthStore.getState().setAccessToken(newToken, refreshData.refreshToken);
      processQueue(newToken);

      // Retry original request with new token
      return apiClient<TResponse, TBody>({
        endpoint,
        method,
        body,
        headers: { ...headers, Authorization: `Bearer ${newToken}` },
        _retry: true,
      });
    } catch {
      refreshQueue = [];
      useAuthStore.getState().clearUserDetails();
      window.location.href = "/login"; // hard redirect — clears all in-flight state
      throw new ApiError("Session expired", 401);
    } finally {
      isRefreshing = false;
    }
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new ApiError(
      errorBody.message || `API Error: ${res.status}`,
      res.status,
      errorBody.code
    );
  }

  return res.json();
}
export class ApiError extends Error {
  public statusCode: number;
  public code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
  }
}