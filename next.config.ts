import type { NextConfig } from "next";

// Set BASE_PATH (e.g. "/gp-designer-web") for a static export served from a sub-path, as on
// GitHub Pages. Left unset (Vercel, local dev) the app builds normally at the domain root.
const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = {
  // Lets a production build live beside a running `next dev` (e.g. NEXT_DIST_DIR=.next-prod).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(basePath && {
    output: "export",
    basePath,
    // Static hosting has no image optimizer; the loader just adds the base path to `src`.
    images: { loader: "custom", loaderFile: "./lib/image-loader.ts" },
  }),
};

export default nextConfig;
