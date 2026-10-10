import { NextResponse, type NextRequest } from "next/server";

// Slovak pages have no language prefix (/kurzy), English ones start with /en (/en/kurzy).
// Every page lives in app/[lang], so a Slovak request is rewritten to /sk/... internally.
// The browser never sees /sk: a visitor who types it is redirected to the address without it.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return;

  if (pathname === "/sk" || pathname.startsWith("/sk/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/sk${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next.js internals and files (anything with a dot, e.g. /images/hero.jpg, /favicon.ico)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
