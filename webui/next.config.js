// next.config.js
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            'node:util': 'util',
            'node:buffer': 'buffer',
            'node:stream': 'stream-browserify',
        };

        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                util: require.resolve('util/'),
                buffer: require.resolve('buffer/'),
                stream: require.resolve('stream-browserify'),
                process: require.resolve('process/browser'),
            };
        }

        return config;
    },
};

export default nextConfig;