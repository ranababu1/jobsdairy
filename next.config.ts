import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default async () => {
  if (process.env.NODE_ENV === 'development') {
    const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
    await setupDevPlatform();
  }
  return nextConfig;
};
