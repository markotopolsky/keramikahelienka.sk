import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // The root layout is app/[lang]/layout.tsx. With a dynamic root segment Next.js cannot render
    // a 404 inside the layout on the server, so app/global-not-found.tsx renders it instead.
    globalNotFound: true,
  },
};

export default nextConfig;
