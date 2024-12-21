/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  rewrites: async () => {
    // Enable dynamic routes with static export. This emulates what the node
    // server would do.
    return [
      {
        source: "/videos/:path*",
        destination: "/videos/page",
      },
      {
        source: "/photos/:path*",
        destination: "/photos/page",
      },
    ];
  },
};

export default nextConfig;
