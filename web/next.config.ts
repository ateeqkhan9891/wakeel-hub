import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Avatar placeholders and dicebear initials are SVGs; allow next/image to
    // serve them (they're sanitized + sandboxed by the CSP below).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
