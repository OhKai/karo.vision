import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  rewrites: async () => {
    // Enable dynamic routes with static export. This emulates what the node
    // server would do.
    return {
      fallback: [
        {
          source: "/videos/:path",
          destination: "/videos/page",
        },
        {
          source: "/photos/:path",
          destination: "/photos/page",
        },
      ],
    };
  },
};

export default nextConfig;
