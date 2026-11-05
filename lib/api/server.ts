import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "./constants";

export function djangoBaseUrl() {
  return (process.env.API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
}

export async function readAuthToken() {
  return (await cookies()).get(AUTH_COOKIE)?.value;
}

const cookieBase = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  path: "/",
};

export function setAuthCookie(response: NextResponse, token: string, remember: boolean) {
  response.cookies.set({
    name: AUTH_COOKIE,
    value: token,
    ...cookieBase,
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE,
    value: "",
    ...cookieBase,
    maxAge: 0,
  });
}

export async function readJson(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { detail: "A API devolveu uma resposta inválida." };
  }
}
