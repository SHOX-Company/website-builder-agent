import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local /public/images/* — no remote domains needed yet.
    // Add domains here if using a CDN or CMS image host later.
    formats: ["image/avif", "image/webp"],
  },
  // Baseline security headers, project-wide. No CSP yet — a real CSP needs
  // careful allowlisting (YouTube iframes, Vercel Blob image host, Resend,
  // fonts) and is a separate, carefully-tested project of its own; these
  // four carry no such risk and are pure upside.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
        ],
      },
    ];
  },
};

export default nextConfig;
