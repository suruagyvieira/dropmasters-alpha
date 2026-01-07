import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* Configurações de performance */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
    minimumCacheTTL: 3600, // Cache de 1 hora no navegador
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // @ts-ignore
  turbopack: {
    root: path.resolve(__dirname),
  },
  reactStrictMode: true,
  poweredByHeader: false, // Segurança: Oculta que a loja usa Next.js
  output: 'standalone',
};

export default nextConfig;
