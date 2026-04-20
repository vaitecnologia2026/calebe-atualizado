import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = new Set<string>([
  "/",
  "/login",
  "/cadastro",
  "/cadastro/obrigado"
]);

const PUBLIC_PREFIXES = [
  "/_next",
  "/favicon",
  "/api/auth",
  "/api/health",
  "/api/webhooks",
  "/api/broker-applications",
  "/manifest.webmanifest",
  "/robots.txt",
  "/icon-",
  "/fonts/"
];

function hasSessionCookie(req: NextRequest): boolean {
  return (
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token") ||
    req.cookies.has("next-auth.session-token") ||
    req.cookies.has("__Secure-next-auth.session-token")
  );
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname) || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isAuthed = hasSessionCookie(req);

  if (pathname.startsWith("/app") && !isAuthed) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
