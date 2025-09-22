/**
 * ROOT LAYOUT - src/app/layout.tsx
 * 
 * Description:
 * Ce fichier définit le layout racine de l'application Next.js 14 avec App Router.
 * Il encapsule toutes les pages de l'application et définit la structure HTML de base.
 * 
 * But:
 * - Fournir la structure HTML commune (html, body, head)
 * - Charger les polices, styles globaux et métadonnées
 * - Intégrer les providers globaux (thème, état, authentification)
 * - Définir la navigation principale et le footer
 * - Gérer les optimisations SEO et performance
 * 
 * Rôle dans l'application:
 * - Point d'entrée unique pour toute l'application
 * - Persiste à travers toutes les navigations (ne se re-rend pas)
 * - Permet l'hydratation côté client des composants React
 * - Centralise la configuration globale de l'UI
 */

import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

// Configuration des polices Google Fonts avec optimisation
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

// Métadonnées SEO optimisées pour l'artisanat français
export const metadata: Metadata = {
  title: {
    default: 'Artisanat Français - Découvrez l\'Excellence du Savoir-Faire Traditionnel',
    template: '%s | Artisanat Français',
  },
  description: 'Plateforme dédiée à la promotion de l\'artisanat français traditionnel. Découvrez des artisans passionnés, leurs créations uniques et le patrimoine culturel français.',
  keywords: [
    'artisanat français',
    'artisans',
    'savoir-faire traditionnel',
    'patrimoine culturel',
    'créations artisanales',
    'made in France',
    'métiers d\'art'
  ],
  authors: [{ name: 'Artisanat Français' }],
  creator: 'Artisanat Français',
  publisher: 'Artisanat Français',
  
  // Open Graph pour les réseaux sociaux
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://artisanat-francais.fr',
    title: 'Artisanat Français - Excellence du Savoir-Faire Traditionnel',
    description: 'Découvrez l\'excellence de l\'artisanat français à travers des créateurs passionnés et leurs œuvres uniques.',
    siteName: 'Artisanat Français',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Artisanat Français - Savoir-faire traditionnel',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Artisanat Français - Excellence du Savoir-Faire',
    description: 'Découvrez l\'excellence de l\'artisanat français',
    images: ['/images/twitter-image.jpg'],
  },
  
  // Configuration du robot d'indexation
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Liens canoniques et alternates
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/fr',
      'en-US': '/en',
    },
  },
  
  // Configuration du manifest PWA
  manifest: '/manifest.json',
  
  // Autres métadonnées importantes
  category: 'Culture & Artisanat',
  classification: 'Business',
  referrer: 'origin-when-cross-origin',
}

// Configuration du viewport pour la responsive et PWA
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  colorScheme: 'light dark',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="fr" 
      className={`${inter.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        {/* Providers globaux pour l'état, thème, etc. */}
        <Providers>
          {/* Structure principale de l'application */}
          <div className="relative flex min-h-screen flex-col">
            {/* Navigation principale */}
            <Navigation />
            
            {/* Contenu principal de la page */}
            <main className="flex-1">
              {children}
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
          
          {/* Composants globaux d'UI */}
          <Toaster />
        </Providers>
        
        {/* Scripts d'analytics et autres (si nécessaire) */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            <script
              defer
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              defer
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}