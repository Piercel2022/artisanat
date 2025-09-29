/**
 * FICHIER: src/app/(public)/artisans/page.tsx
 * 
 * NOM: Page Liste des Artisans
 * 
 * DESCRIPTION:
 * Page publique qui affiche la liste complète des artisans référencés sur la plateforme.
 * Propose des fonctionnalités de recherche, filtrage par métier/région, et pagination.
 * Interface responsive avec cartes artisans contenant photo, nom, métier, localisation
 * et lien vers le profil détaillé.
 * 
 * RÔLE DANS L'APPLICATION:
 * - Point d'entrée principal pour découvrir les artisans français
 * - Page de navigation centrale vers les profils individuels
 * - Interface de recherche et découverte pour les visiteurs
 * - Vitrine collective des savoir-faire artisanaux
 * 
 * RELATIONS AVEC L'ENSEMBLE:
 * - Route publique accessible depuis le menu principal
 * - Consomme l'API /api/artisans pour récupérer les données
 * - Utilise les composants UI partagés (SearchBar, FilterPanel, ArtisanCard)
 * - Redirige vers les pages profil individuelles [slug]
 * - Intégrée dans le layout public avec header/footer
 * - Référencée dans le sitemap pour le SEO
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import ArtisansList from '@/components/features/artisans/ArtisansList';
import SearchFilters from '@/components/features/artisans/SearchFilters';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

// Métadonnées SEO optimisées pour la découverte
export const metadata: Metadata = {
  title: 'Artisans Français - Découvrez les Maîtres Artisans de France',
  description: 'Explorez notre annuaire des meilleurs artisans français. Potiers, ébénistes, maroquiniers, bijoutiers... Trouvez l\'artisan près de chez vous.',
  keywords: 'artisans français, savoir-faire, métiers d\'art, artisanat traditionnel, made in France',
  openGraph: {
    title: 'Artisans Français - Annuaire des Maîtres Artisans',
    description: 'Découvrez les artisans qui perpétuent les traditions françaises',
    type: 'website',
  },
};

// Interface pour les paramètres de recherche URL
interface SearchParams {
  search?: string;
  metier?: string;
  region?: string;
  page?: string;
  sort?: 'name' | 'recent' | 'popular';
}

interface ArtisansPageProps {
  searchParams: SearchParams;
}

export default function ArtisansPage({ searchParams }: ArtisansPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* Header de la page avec titre et introduction */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-stone-900 mb-4">
              Nos Artisans
            </h1>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Découvrez les artisans passionnés qui perpétuent les traditions 
              françaises à travers leurs créations uniques et leur savoir-faire d&apos;exception.
            </p>
          </div>
        </div>
      </section>

      {/* Section principale avec filtres et liste */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          
          {/* Sidebar avec filtres de recherche */}
          <aside className="lg:col-span-1 mb-8 lg:mb-0">
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 sticky top-8">
              <h2 className="font-semibold text-stone-900 mb-4">
                Filtrer les artisans
              </h2>
              <Suspense fallback={<div className="animate-pulse bg-stone-200 h-64 rounded" />}>
                <SearchFilters searchParams={searchParams} />
              </Suspense>
            </div>
          </aside>

          {/* Zone principale avec liste des artisans */}
          <section className="lg:col-span-3">
            <Suspense fallback={<LoadingSkeleton type="artisan-grid" />}>
              <ArtisansList searchParams={searchParams} />
            </Suspense>
          </section>
        </div>
      </main>

      {/* Section CTA pour encourager les inscriptions */}
      <section className="bg-amber-600 text-white py-12 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Vous êtes artisan ?
          </h2>
          <p className="text-xl mb-6 text-amber-100">
            Rejoignez notre communauté et valorisez votre savoir-faire
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
          >
            Nous rejoindre
          </a>
        </div>
      </section>
    </div>
  );
}