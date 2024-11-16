/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEYNAR_API_KEY: process.env.NEYNAR_API_KEY,
        NEXT_PUBLIC_DUNE_API_KEY: process.env.NEXT_PUBLIC_DUNE_API_KEY,
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
            };
        }
        return config;
    },
};

export default nextConfig;
