import { NextResponse } from "next/server";
import { djangoBaseUrl, readAuthToken, readJson } from "@/lib/api/server";

export async function GET() {
  const token = await readAuthToken();
  if (!token) {
    return NextResponse.json({ detail: "Não autenticado" }, { status: 401 });
  }

  let response: Response;
  try {
    response = await fetch(`${djangoBaseUrl()}/api/auth/me/`, {
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ detail: "Não foi possível conectar à API." }, { status: 502 });
  }

  const data = await readJson(response);
  return NextResponse.json(data, { status: response.status });
}
