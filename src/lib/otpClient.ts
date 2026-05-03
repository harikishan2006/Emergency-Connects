/**
 * Thin client for the local Node.js OTP server.
 * Base URL is stored in localStorage so users can change it from the
 * OTP Settings page without rebuilding the app.
 */
const STORAGE_KEY = "otpApiBaseUrl";
const DEFAULT_URL = "http://localhost:3001";

export const getOtpApiUrl = (): string => {
  if (typeof window === "undefined") return DEFAULT_URL;
  return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_URL;
};

export const setOtpApiUrl = (url: string): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, url.replace(/\/+$/, ""));
};

const request = async <T,>(path: string, body?: unknown): Promise<T> => {
  const base = getOtpApiUrl();
  const res = await fetch(`${base}${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data as T;
};

export const sendOtp = (email: string) =>
  request<{ ok: true; expiresIn: number }>("/api/otp/send", { email });

export const verifyOtp = (email: string, code: string) =>
  request<{ ok: true }>("/api/otp/verify", { email, code });

export const checkHealth = () =>
  request<{ ok: boolean; smtp: string; from: string | null }>("/health");