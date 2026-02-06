import type { NextConfig } from "next";

const nextConfig: NextConfig = {
rewrites: async () => {
      return {
              fallback: [
                {
                            source: "/:path*",
                            destination: "/",
                },
                      ],
      };
},
};

export default nextConfig;
