import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Department pages live at /<id> (app/(main)/(dept)/[deptId]); keep old /teams/<id> bookmarks working.
  async redirects() {
    return [{ source: "/teams/:id", destination: "/:id", permanent: false }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
