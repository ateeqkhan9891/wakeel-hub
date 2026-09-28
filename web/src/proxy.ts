import { NextResponse, type NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";

const ROLE_HOME: Record<string, string> = {
  client: "/dashboard/client",
  lawyer: "/dashboard/lawyer",
  admin: "/dashboard/admin",
};

const DASHBOARD_SECTIONS = ["client", "lawyer", "admin"] as const;

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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isOnboarding = pathname.startsWith("/onboarding");
  const isAuthPage =
    pathname === "/login" || pathname.startsWith("/register");

  const redirectTo = (path: string, search = "") => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = search;

    const redirect = NextResponse.redirect(url);

    response.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie);
    });

    return redirect;
  };

  if (!user) {
    if (isDashboard || isOnboarding) {
      return redirectTo(
        "/login",
        `?redirectTo=${encodeURIComponent(pathname)}`
      );
    }

    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    if (isDashboard || isOnboarding) {
      return redirectTo(
        "/login",
        `?redirectTo=${encodeURIComponent(pathname)}`
      );
    }

    return response;
  }

  const role = profile.role as string;
  const home = ROLE_HOME[role] ?? "/dashboard/client";

  if (!profile.onboarding_completed) {
    if (!isOnboarding) {
      return redirectTo("/onboarding");
    }

    return response;
  }

  if (isOnboarding) {
    return redirectTo(home);
  }

  if (isAuthPage) {
    return redirectTo(home);
  }

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

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/login",
    "/register/:path*",
  ],
};