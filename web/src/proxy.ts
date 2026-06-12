import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ROLE_HOME: Record<string, string> = {
  client: "/dashboard/client",
  lawyer: "/dashboard/lawyer",
  admin: "/dashboard/admin",
};

const DASHBOARD_SECTIONS = ["client", "lawyer", "admin"] as const;

/**
 * Auth proxy (Next.js 16 renamed Middleware → Proxy).
 *
 * Runs on /dashboard, /login and /register. It:
 *   1. Refreshes the Supabase auth session cookies on every request.
 *   2. Blocks unauthenticated visitors from any /dashboard route.
 *   3. Sends already-signed-in users away from /login & /register.
 *   4. Enforces role isolation - a client can't open /dashboard/lawyer, etc.
 *
 * Real data access is additionally protected by Row Level Security in the
 * database and by a server-side guard in each dashboard layout, so this is
 * the fast first line of defence, not the only one.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: getUser() validates the token against the Supabase auth
  // server (do not trust getSession() alone inside a proxy).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage = pathname === "/login" || pathname.startsWith("/register");

  // Carry any refreshed auth cookies onto a redirect response.
  const redirectTo = (path: string, search = "") => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = search;
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  // 1) Not signed in → cannot reach any dashboard.
  if (isDashboard && !user) {
    return redirectTo("/login", `?redirectTo=${encodeURIComponent(pathname)}`);
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      if (isDashboard) return redirectTo("/login", `?redirectTo=${encodeURIComponent(pathname)}`);
      return response;
    }

    const role = profile.role as string;
    const home = ROLE_HOME[role] ?? "/dashboard/client";

    // 2) Signed in but on /login or /register → go to their dashboard.
    if (isAuthPage) {
      return redirectTo(home);
    }

    // 3) Role isolation across dashboard sections.
    if (isDashboard) {
      const section = pathname.split("/")[2];
      if (
        section &&
        (DASHBOARD_SECTIONS as readonly string[]).includes(section) &&
        section !== role
      ) {
        return redirectTo(home);
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register/:path*"],
};
