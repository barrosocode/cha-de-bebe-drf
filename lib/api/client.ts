import axios, { AxiosError, type AxiosInstance } from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { isProtectedPath } from "./constants";

export const api: AxiosInstance = axios.create({
  baseURL: "/api/backend",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (config.data !== undefined && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

let redirecting = false;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined" && isProtectedPath(window.location.pathname) && !redirecting) {
      redirecting = true;
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export function readErrorPayload(error: unknown): Record<string, unknown> | null {
  if (!axios.isAxiosError(error)) return null;
  const data = error.response?.data;
  if (Array.isArray(data)) return { non_field_errors: data };
  if (data && typeof data === "object") return data as Record<string, unknown>;
  return null;
}

export function messageFrom(value: unknown): string {
  if (Array.isArray(value)) return value.map(String).join(" ");
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return Object.values(value as Record<string, unknown>).map(messageFrom).join(" ");
  return "";
}

export function getErrorMessage(error: unknown, fallback = "Não foi possível concluir a operação.") {
  if (!axios.isAxiosError(error)) return fallback;
  if (!error.response) return "Não foi possível conectar à API.";
  if (error.response.status === 404) return fallback;
  const payload = readErrorPayload(error);
  if (payload) {
    const detail = messageFrom(payload.detail) || messageFrom(payload.non_field_errors) || messageFrom(payload.message);
    if (detail) return detail;
  }
  if (error.response.status >= 500) return "Ocorreu um erro interno. Tente novamente em instantes.";
  return fallback;
}

export function applyFieldErrors<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>) {
  if (!axios.isAxiosError(error) || error.response?.status !== 400) return false;
  const payload = readErrorPayload(error);
  if (!payload) return false;

  let mapped = false;
  for (const [key, value] of Object.entries(payload)) {
    const message = messageFrom(value);
    if (!message) continue;
    if (key === "non_field_errors" || key === "detail") {
      setError("root", { message });
    } else {
      setError(key as Path<T>, { message });
    }
    mapped = true;
  }
  return mapped;
}

export function notifyRequestError<T extends FieldValues>(error: unknown, toast: (message: string) => void, setError?: UseFormSetError<T>) {
  if (setError && applyFieldErrors(error, setError)) {
    const payload = readErrorPayload(error);
    const root = messageFrom(payload?.detail) || messageFrom(payload?.non_field_errors);
    if (root) toast(root);
    return;
  }
  if (axios.isAxiosError(error) && error.response?.status === 500) {
    toast("Ocorreu um erro interno. Tente novamente em instantes.");
    return;
  }
  toast(getErrorMessage(error));
}
