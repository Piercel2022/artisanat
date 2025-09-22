/**
 * LOADING PAGE - src/app/loading.tsx
 * 
 * Description:
 * Page de chargement globale qui s'affiche pendant la navigation entre les pages
 * ou lors du chargement initial de l'application.
 * 
 * But:
 * - Améliorer l'expérience utilisateur pendant les temps de chargement
 * - Fournir un feedback visuel cohérent dans toute l'application
 * - Éviter les écrans blancs lors des transitions
 * 
 * Rôle dans l'application:
 * - S'affiche automatiquement lors du chargement des pages
 * - Utilise le système de loading UI de Next.js 14 App Router
 * - Peut être overridé par des loading.tsx plus spécifiques dans les sous-routes
 */

import { Loader2, Palette } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="flex flex-col items-center space-y-6 text-center">
        {/* Logo et icône animée */}
        <div className="relative">
          <div className="animate-pulse">
            <Palette className="h-16 w-16 text-amber-600" />
          </div>
          <Loader2 className="absolute -bottom-2 -right-2 h-6 w-6 animate-spin text-orange-500" />
        </div>
        
        {/* Texte de chargement */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Chargement en cours...
          </h2>
          <p className="text-sm text-gray-600 max-w-md">
            Nous préparons le meilleur de l'artisanat français pour vous
          </p>
        </div>
        
        {/* Barre de progression animée */}
        <div className="w-64 bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full animate-pulse"></div>
        </div>
        
        {/* Points de chargement animés */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}