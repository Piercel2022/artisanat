/**
 * NOT FOUND PAGE - src/app/not-found.tsx
 * 
 * Description:
 * Page 404 globale qui s'affiche lorsqu'une route n'existe pas ou 
 * lorsqu'une fonction notFound() est appelée dans l'application.
 * 
 * But:
 * - Gérer les URLs inexistantes de manière élégante
 * - Aider l'utilisateur à retrouver son chemin
 * - Maintenir l'engagement utilisateur même sur une erreur 404
 * - Améliorer le SEO avec une page 404 personnalisée
 * 
 * Rôle dans l'application:
 * - S'affiche automatiquement pour les routes non définies
 * - Peut être déclenchée manuellement avec notFound() dans les Server Components
 * - Remplace la page 404 par défaut de Next.js
 * - Peut être overridée par des not-found.tsx plus spécifiques dans les sous-routes
 */

import { Search, Home, Users, Package, Phone, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Illustration 404 créative */}
        <div className="relative">
          {/* Grand "404" stylisé */}
          <div className="text-[150px] sm:text-[200px] font-bold text-amber-200 leading-none select-none">
            404
          </div>
          
          {/* Éléments décoratifs d'artisanat */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center space-x-4 text-amber-600">
              <Package className="w-8 h-8 animate-bounce" style={{ animationDelay: '0s' }} />
              <Users className="w-10 h-10 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <Search className="w-8 h-8 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>

        {/* Message principal */}
        <div className="space-y-4 -mt-8">
          <h1 className="text-4xl font-bold text-gray-900 font-playfair">
            Page introuvable
          </h1>
          
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Cette page semble avoir été perdue dans les méandres de l'artisanat français...
          </p>
          
          <p className="text-gray-500">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        {/* Barre de recherche rapide */}
        <div className="max-w-md mx-auto">
          <div className="flex gap-2">
            <Input 
              type="search"
              placeholder="Rechercher un artisan, un produit..."
              className="flex-1"
            />
            <Button size="icon" variant="outline">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation suggérée */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Button 
            asChild 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-24 hover:bg-amber-50 hover:border-amber-200"
          >
            <Link href="/">
              <Home className="w-6 h-6 text-amber-600" />
              <span className="text-sm">Accueil</span>
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-24 hover:bg-amber-50 hover:border-amber-200"
          >
            <Link href="/artisans">
              <Users className="w-6 h-6 text-amber-600" />
              <span className="text-sm">Artisans</span>
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-24 hover:bg-amber-50 hover:border-amber-200"
          >
            <Link href="/catalogue">
              <Package className="w-6 h-6 text-amber-600" />
              <span className="text-sm">Catalogue</span>
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-24 hover:bg-amber-50 hover:border-amber-200"
          >
            <Link href="/contact">
              <Phone className="w-6 h-6 text-amber-600" />
              <span className="text-sm">Contact</span>
            </Link>
          </Button>
        </div>

        {/* Actions principales */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          
          <Button 
            asChild
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>

        {/* Message d'aide */}
        <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Vous pensiez trouver quelque chose de spécifique ?
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <Link 
              href="/artisans" 
              className="text-amber-600 hover:text-amber-700 underline"
            >
              Découvrir nos artisans
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/catalogue" 
              className="text-amber-600 hover:text-amber-700 underline"
            >
              Parcourir le catalogue
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/contact" 
              className="text-amber-600 hover:text-amber-700 underline"
            >
              Nous contacter
            </Link>
          </div>
        </div>

        {/* Code d'erreur pour le debug */}
        <p className="text-xs text-gray-400">
          Erreur 404 - Page non trouvée
        </p>
      </div>
    </div>
  )
}