import { NextRequest, NextResponse } from "next/server";
import { djangoBaseUrl, readJson, setAuthCookie } from "@/lib/api/server";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { username?: string; password?: string; remember?: boolean } | null;
  if (!body?.username || !body.password) {
    return NextResponse.json({ username: ["Informe o usuário e a senha."] }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(`${djangoBaseUrl()}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: body.username, password: body.password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ detail: "Não foi possível conectar à API." }, { status: 502 });
  }

  const data = (await readJson(response)) as { token?: string; user?: unknown };
  if (!response.ok || !data.token) {
    return NextResponse.json(data, { status: response.status });
  }

  const result = NextResponse.json({ user: data.user });
  setAuthCookie(result, data.token, Boolean(body.remember));
  return result;
}
