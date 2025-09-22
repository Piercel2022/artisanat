// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@headlessui/react'
    ],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.artisanatfrancais.fr',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com;
              style-src 'self' 'unsafe-inline' fonts.googleapis.com;
              img-src 'self' data: blob: *.cloudinary.com *.unsplash.com;
              font-src 'self' fonts.gstatic.com;
              connect-src 'self' *.vercel-analytics.com;
            `.replace(/\s{2,}/g, ' ').trim()
          },
        ],
      },
    ]
  },

  // Rewrites pour SEO
  async rewrites() {
    return [
      {
        source: '/artisan/:slug',
        destination: '/artisans/:slug',
      },
      {
        source: '/produit/:slug',
        destination: '/catalogue/produit/:slug',
      }
    ]
  },

  // Compression et cache
  compress: true,
  poweredByHeader: false,

  // Configuration webpack conditionnelle
  webpack: (config: { plugins: any[]; module: { rules: { test: RegExp; use: string[] }[] } }, { isServer }: any) => {
    // Bundle analyzer (développement uniquement)
    if (process.env.ANALYZE === 'true' && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      )
    }

    // Configuration SVG (optionnelle)
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

module.exports = nextConfig