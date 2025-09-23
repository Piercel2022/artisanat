/**
 * FICHIER: src/components/features/artisans/RelatedArtisans.tsx
 * 
 * NOM: Composant Artisans Similaires
 * 
 * DESCRIPTION:
 * Affiche une liste d'artisans similaires basée sur le métier et la région.
 * Utilisé pour encourager la découverte d'autres artisans et améliorer la navigation.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getRelatedArtisans } from '@/lib/api/artisans';
import { Artisan } from '@/types/artisan';

interface RelatedArtisansProps {
  currentArtisanSlug: string;
  craft: string;
  region: string;
  limit?: number;
}

const RelatedArtisans: React.FC<RelatedArtisansProps> = async ({ 
  currentArtisanSlug, 
  craft, 
  region, 
  limit = 3 
}) => {
  let relatedArtisans: Artisan[] = [];

  try {
    relatedArtisans = await getRelatedArtisans(currentArtisanSlug, craft, region, limit);
  } catch (error) {
    console.error('Erreur lors du chargement des artisans similaires:', error);
    return (
      <div className="text-center py-8">
        <p className="text-stone-600">
          Impossible de charger les artisans similaires pour le moment.
        </p>
      </div>
    );
  }

  if (relatedArtisans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-stone-600">
          Aucun autre artisan {craft.toLowerCase()} trouvé dans la région.
        </p>
        <Link 
          href="/artisans" 
          className="inline-flex items-center mt-4 text-amber-600 hover:text-amber-700 font-medium"
        >
          Voir tous les artisans
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {relatedArtisans.map((artisan) => (
        <Link 
          key={artisan.slug} 
          href={`/artisans/${artisan.slug}`}
          className="group bg-white rounded-lg overflow-hidden border border-stone-200 hover:border-amber-300 transition-all duration-300 hover:shadow-lg"
        >
          {/* Image de profil */}
          <div className="relative h-64 bg-stone-100 overflow-hidden">
            {artisan.profileImage ? (
              <Image
                src={artisan.profileImage}
                alt={`Portrait de ${artisan.name}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                <div className="w-16 h-16 bg-stone-400 rounded-full flex items-center justify-center">
                  <span className="text-stone-600 text-2xl font-semibold">
                    {artisan.firstName?.charAt(0) || artisan.name.charAt(0)}
                  </span>
                </div>
              </div>
            )}
            
            {/* Badge métier */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-stone-700 backdrop-blur-sm">
                {artisan.craft}
              </span>
            </div>
          </div>

          {/* Informations artisan */}
          <div className="p-6">
            <h3 className="font-semibold text-stone-900 text-lg mb-1 group-hover:text-amber-700 transition-colors">
              {artisan.name}
            </h3>
            
            <p className="text-stone-600 text-sm mb-3">
              {artisan.city}, {artisan.region}
            </p>
            
            <p className="text-stone-700 text-sm leading-relaxed line-clamp-3">
              {artisan.shortDescription}
            </p>

            {/* Spécialités */}
            {artisan.specialties && artisan.specialties.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {artisan.specialties.slice(0, 3).map((specialty, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-stone-100 text-stone-600"
                  >
                    {specialty}
                  </span>
                ))}
                {artisan.specialties.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-stone-100 text-stone-600">
                    +{artisan.specialties.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Call to action */}
            <div className="mt-4 flex items-center text-amber-600 text-sm font-medium group-hover:text-amber-700 transition-colors">
              Voir le profil
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedArtisans;