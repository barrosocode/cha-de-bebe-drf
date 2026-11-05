export const AUTH_COOKIE = "auth_token";

export const PROTECTED_PREFIXES = ["/dashboard", "/convidados", "/convites", "/presentes", "/reservados"];

export function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
