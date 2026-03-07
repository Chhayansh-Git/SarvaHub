/**
 * SarvaHub API Client
 *
 * Centralized fetch wrapper that:
 * - Prepends the /api/v1/ base path (proxied via Next.js rewrites)
 * - Attaches Authorization header from Zustand userStore
 * - Parses JSON and throws structured errors matching the backend contract
 * - Handles 401 → auto-logout
 */
import { useUserStore } from '@/store/userStore';

// ─── Types ──────────────────────────────────────────────────────────

export interface ApiError {
    code: string;
    message: string;
}

export class ApiRequestError extends Error {
    code: string;
    status: number;

    constructor(status: number, code: string, message: string) {
        super(message);
        this.name = 'ApiRequestError';
        this.code = code;
        this.status = status;
    }
}

// ─── Helpers ────────────────────────────────────────────────────────

function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;

    // 1. Try reading directly from memory to bypass strict browser storage policies
    try {
        const memoryToken = useUserStore.getState().accessToken;
        if (memoryToken) return memoryToken;
    } catch {
        // ignore
    }

    // 2. Fallback to localStorage
    try {
        const raw = localStorage.getItem('auth-storage');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.state?.accessToken ?? null;
    } catch {
        return null;
    }
}

function handleUnauthorized() {
    if (typeof window === 'undefined') return;
    try {
        // Clear auth state from localStorage
        const raw = localStorage.getItem('auth-storage');
        if (raw) {
            const parsed = JSON.parse(raw);
            parsed.state = {
                ...parsed.state,
                user: null,
                accessToken: null,
                isAuthenticated: false,
            };
            localStorage.setItem('auth-storage', JSON.stringify(parsed));
        }
        // Reload to reflect logged-out state
        window.location.href = '/';
    } catch {
        // Fallback
        localStorage.removeItem('auth-storage');
        window.location.href = '/';
    }
}

// ─── Core Fetch ─────────────────────────────────────────────────────

const API_BASE = '/api/v1';

interface FetchOptions extends Omit<RequestInit, 'body'> {
    body?: Record<string, unknown> | FormData | null;
    /** Skip JSON content-type (e.g., for multipart uploads) */
    raw?: boolean;
}

export async function apiFetch<T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { body, raw, headers: customHeaders, ...rest } = options;

    const headers: Record<string, string> = {};

    // Auth header
    const token = getAccessToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Content-Type (skip for FormData / raw)
    if (!raw && !(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    // Merge custom headers
    if (customHeaders) {
        const custom = customHeaders instanceof Headers
            ? Object.fromEntries(customHeaders.entries())
            : (customHeaders as Record<string, string>);
        Object.assign(headers, custom);
    }

    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const response = await fetch(url, {
        ...rest,
        headers,
        body: body instanceof FormData
            ? body
            : body
                ? JSON.stringify(body)
                : undefined,
        credentials: 'include', // Send cookies for HttpOnly auth
    });

    // Handle 204 No Content
    if (response.status === 204) {
        return undefined as T;
    }

    // Parse JSON response
    let data: any;
    const text = await response.text();

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            // The response is not valid JSON — this usually means the Next.js proxy
            // returned an HTML error page because the backend was temporarily unreachable.
            if (!response.ok) {
                throw new ApiRequestError(
                    response.status,
                    'SERVER_ERROR',
                    response.status === 500
                        ? 'The server is temporarily unavailable. Please try again in a moment.'
                        : `Request failed with status ${response.status}`
                );
            }
            // If response was 2xx but not JSON, return the raw text
            return text as any as T;
        }
    }

    // Handle error responses
    if (!response.ok) {
        const error = data?.error || data;
        const code = error?.code || 'UNKNOWN_ERROR';
        const message = error?.message || error?.error || `Request failed with status ${response.status}`;

        // Auto-logout on 401, but NOT during login/register attempts where 401 just means bad credentials
        if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/register')) {
            handleUnauthorized();
        }

        throw new ApiRequestError(response.status, code, message);
    }

    return data as T;
}

// ─── Convenience Methods ────────────────────────────────────────────

export const api = {
    get: <T = unknown>(endpoint: string, options?: FetchOptions) =>
        apiFetch<T>(endpoint, { ...options, method: 'GET' }),

    post: <T = unknown>(endpoint: string, body?: Record<string, unknown> | FormData | null, options?: FetchOptions) =>
        apiFetch<T>(endpoint, { ...options, method: 'POST', body: body as any }),

    patch: <T = unknown>(endpoint: string, body?: Record<string, unknown> | null, options?: FetchOptions) =>
        apiFetch<T>(endpoint, { ...options, method: 'PATCH', body: body as any }),

    put: <T = unknown>(endpoint: string, body?: Record<string, unknown> | null, options?: FetchOptions) =>
        apiFetch<T>(endpoint, { ...options, method: 'PUT', body: body as any }),

    delete: <T = unknown>(endpoint: string, options?: FetchOptions) =>
        apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),

    /** Upload form data (multipart) */
    upload: <T = unknown>(endpoint: string, formData: FormData, options?: FetchOptions) =>
        apiFetch<T>(endpoint, { ...options, method: 'POST', body: formData, raw: true }),
};
