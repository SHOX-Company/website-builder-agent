import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local /public/images/* — no remote domains needed yet.
    // Add domains here if using a CDN or CMS image host later.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
