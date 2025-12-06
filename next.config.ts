import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    trailingSlash: false,
    async rewrites() {
        return [
            {
                source: '/:shortCode',
                destination: '/',
            },
        ]
    },
};

module.exports = nextConfig;