/**
 * ERROR PAGE - src/app/error.tsx
 * 
 * Description:
 * Page d'erreur globale qui s'affiche en cas d'erreur client-side dans l'application.
 * Doit être un Client Component pour pouvoir gérer les erreurs interactives.
 * 
 * But:
 * - Capturer et afficher les erreurs de manière élégante
 * - Permettre à l'utilisateur de récupérer de l'erreur
 * - Fournir des informations de debug en développement
 * - Maintenir une expérience utilisateur cohérente même en cas d'erreur
 * 
 * Rôle dans l'application:
 * - S'active automatiquement lors d'erreurs JavaScript côté client
 * - Enveloppe les composants enfants dans un Error Boundary
 * - Peut être overridé par des error.tsx plus spécifiques dans les sous-routes
 * - Ne capture PAS les erreurs des layouts parents ou des Server Components
 */

'use client' // Obligatoire pour les error pages

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log l'erreur pour le monitoring (Sentry, LogRocket, etc.)
    console.error('Application Error:', error)
    
    // En production, envoyer l'erreur à un service de monitoring
    if (process.env.NODE_ENV === 'production') {
      // Exemple: Sentry.captureException(error)
    }
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icône d'erreur */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Titre et message d'erreur */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 font-playfair">
            Oups ! Une erreur s'est produite
          </h1>
          
          <p className="text-gray-600 leading-relaxed">
            Nous sommes désolés, mais quelque chose s'est mal passé. 
            Notre équipe a été notifiée et travaille à résoudre le problème.
          </p>

          {/* Détails de l'erreur en mode développement */}
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-gray-100 rounded-lg p-4 text-sm">
              <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                Détails techniques (dev only)
              </summary>
              <pre className="whitespace-pre-wrap text-red-600 overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
                {error.digest && `\n\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </div>

        {/* Actions de récupération */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={reset}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </Button>
          
          <Button 
            variant="outline" 
            asChild
            className="flex items-center gap-2"
          >
            <a href="/">
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </a>
          </Button>
        </div>

        {/* Message de support */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Si le problème persiste, n'hésitez pas à nous contacter.
          </p>
          
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="mt-2 text-gray-600 hover:text-gray-900"
          >
            <a href="/contact" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contacter le support
            </a>
          </Button>
        </div>

        {/* Numéro de référence de l'erreur */}
        {error.digest && (
          <p className="text-xs text-gray-400">
            Référence d'erreur: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}