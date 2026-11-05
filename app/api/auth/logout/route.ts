import { NextResponse } from "next/server";
import { clearAuthCookie, djangoBaseUrl, readAuthToken } from "@/lib/api/server";

export async function POST() {
  const token = await readAuthToken();
  if (token) {
    await fetch(`${djangoBaseUrl()}/api/auth/logout/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    }).catch(() => undefined);
  }

  const result = NextResponse.json({ message: "Logout realizado com sucesso" });
  clearAuthCookie(result);
  return result;
}
