import { readFileSync } from "node:fs";

// Cloudflare skips public/_redirects once a worker serves the site, so the same
// rules are applied here. The file stays the one place to edit them.
const retired = readFileSync(new URL("./public/_redirects", import.meta.url), "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => {
    const [source, destination] = line.split(/\s+/);
    return { source: source.replace(/\*$/, ":rest+"), destination, permanent: true };
  });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return retired;
  },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
