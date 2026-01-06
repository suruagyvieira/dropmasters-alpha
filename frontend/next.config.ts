import type { NextConfig } from "next";

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
  reactStrictMode: true,
  poweredByHeader: false, // Segurança: Oculta que a loja usa Next.js

  /* HEADERS DE SEGURANÇA (CRÍTICO PARA PRODUÇÃO) */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN' // Protege contra Clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff' // Protege contra MIME Type Sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()' // Privacidade
          }
        ]
      }
    ];
  }
};

export default nextConfig;
