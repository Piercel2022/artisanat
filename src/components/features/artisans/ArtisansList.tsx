/**
 * FICHIER: src/components/features/artisans/ArtisansList.tsx
 * 
 * NOM: Composant Liste des Artisans
 * 
 * DESCRIPTION:
 * Composant qui affiche la liste paginée des artisans avec leurs informations
 * principales sous forme de cartes. Gère la récupération des données depuis l'API,
 * l'affichage conditionnel selon les filtres, et la pagination.
 * 
 * FONCTIONNALITÉS:
 * - Récupération des artisans via l'API
 * - Affichage en grille responsive
 * - Pagination intégrée
 * - États de chargement et d'erreur
 * - Tri par nom, récence, popularité
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';

// Types pour les données artisan
interface Artisan {
  id: string;
  slug: string;
  nom: string;
  prenom: string;
  metier: string;
  specialites: string[];
  ville: string;
  region: string;
  photo?: string;
  note_moyenne?: number;
  nb_avis?: number;
  description_courte?: string;
  certifications?: string[];
  date_creation: string;
}

interface ArtisansResponse {
  artisans: Artisan[];
  total: number;
  page: number;
  totalPages: number;
}

interface SearchParams {
  search?: string;
  metier?: string;
  region?: string;
  page?: string;
  sort?: 'name' | 'recent' | 'popular';
}

interface ArtisansListProps {
  searchParams: SearchParams;
}

export default function ArtisansList({ searchParams }: ArtisansListProps) {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1
  });

  // Fetch des artisans basé sur les paramètres de recherche
  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        setError(null);

        // Construction de l'URL avec paramètres
        const params = new URLSearchParams();
        if (searchParams.search) params.set('search', searchParams.search);
        if (searchParams.metier) params.set('metier', searchParams.metier);
        if (searchParams.region) params.set('region', searchParams.region);
        if (searchParams.page) params.set('page', searchParams.page);
        if (searchParams.sort) params.set('sort', searchParams.sort);

        const response = await fetch(`/api/artisans?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des artisans');
        }

        const data: ArtisansResponse = await response.json();
        
        setArtisans(data.artisans);
        setPagination({
          total: data.total,
          page: data.page,
          totalPages: data.totalPages
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, [searchParams]);

  // Composant carte artisan
  const ArtisanCard = ({ artisan }: { artisan: Artisan }) => (
    <Link 
      href={`/artisans/${artisan.slug}`}
      className="group block bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1"
    >
      {/* Image de profil */}
      <div className="relative h-48 bg-stone-100">
        {artisan.photo ? (
          <Image
            src={artisan.photo}
            alt={`${artisan.prenom} ${artisan.nom}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-100 to-stone-100">
            <span className="text-4xl font-bold text-amber-600">
              {artisan.prenom[0]}{artisan.nom[0]}
            </span>
          </div>
        )}
      </div>

      {/* Contenu de la carte */}
      <div className="p-6">
        {/* Nom et métier */}
        <h3 className="font-semibold text-lg text-stone-900 mb-1">
          {artisan.prenom} {artisan.nom}
        </h3>
        <p className="text-amber-600 font-medium mb-2">{artisan.metier}</p>

        {/* Spécialités */}
        {artisan.specialites.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {artisan.specialites.slice(0, 2).map((specialite, index) => (
                <span 
                  key={index}
                  className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded"
                >
                  {specialite}
                </span>
              ))}
              {artisan.specialites.length > 2 && (
                <span className="text-xs text-stone-500">
                  +{artisan.specialites.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Localisation */}
        <div className="flex items-center text-stone-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{artisan.ville}, {artisan.region}</span>
        </div>

        {/* Note et avis */}
        {artisan.note_moyenne && artisan.nb_avis && (
          <div className="flex items-center mb-3">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
            <span className="text-sm font-medium text-stone-700 ml-1">
              {artisan.note_moyenne.toFixed(1)}
            </span>
            <span className="text-sm text-stone-500 ml-1">
              ({artisan.nb_avis} avis)
            </span>
          </div>
        )}

        {/* Description courte */}
        {artisan.description_courte && (
          <p className="text-sm text-stone-600 line-clamp-2 mb-3">
            {artisan.description_courte}
          </p>
        )}

        {/* Certifications */}
        {artisan.certifications && artisan.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {artisan.certifications.slice(0, 2).map((cert, index) => (
              <span 
                key={index}
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
              >
                {cert}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );

  // Composant de pagination
  const Pagination = () => {
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;

    if (totalPages <= 1) return null;

    const getPageUrl = (page: number) => {
      const params = new URLSearchParams();
      if (searchParams.search) params.set('search', searchParams.search);
      if (searchParams.metier) params.set('metier', searchParams.metier);
      if (searchParams.region) params.set('region', searchParams.region);
      if (searchParams.sort) params.set('sort', searchParams.sort);
      params.set('page', page.toString());
      return `?${params.toString()}`;
    };

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        {/* Page précédente */}
        {currentPage > 1 && (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="flex items-center px-3 py-2 text-sm font-medium text-stone-500 bg-white border border-stone-300 rounded-md hover:bg-stone-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Précédent
          </Link>
        )}

        {/* Numéros de page */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNumber;
          if (totalPages <= 5) {
            pageNumber = i + 1;
          } else if (currentPage <= 3) {
            pageNumber = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNumber = totalPages - 4 + i;
          } else {
            pageNumber = currentPage - 2 + i;
          }

          return (
            <Link
              key={pageNumber}
              href={getPageUrl(pageNumber)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                pageNumber === currentPage
                  ? 'text-white bg-amber-600 border border-amber-600'
                  : 'text-stone-900 bg-white border border-stone-300 hover:bg-stone-50'
              }`}
            >
              {pageNumber}
            </Link>
          );
        })}

        {/* Page suivante */}
        {currentPage < totalPages && (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="flex items-center px-3 py-2 text-sm font-medium text-stone-500 bg-white border border-stone-300 rounded-md hover:bg-stone-50"
          >
            Suivant
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>
    );
  };

  // États de chargement et d'erreur
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-stone-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-stone-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-stone-200 overflow-hidden animate-pulse">
              <div className="h-48 bg-stone-200"></div>
              <div className="p-6 space-y-3">
                <div className="h-5 bg-stone-200 rounded w-3/4"></div>
                <div className="h-4 bg-stone-200 rounded w-1/2"></div>
                <div className="h-4 bg-stone-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-medium mb-2">Erreur de chargement</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (artisans.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-stone-800 font-medium mb-2">Aucun artisan trouvé</h3>
          <p className="text-stone-600 text-sm mb-4">
            Essayez de modifier vos critères de recherche ou supprimez certains filtres.
          </p>
          <Link 
            href="/artisans"
            className="inline-block px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
          >
            Voir tous les artisans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header avec comptage et tri */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <p className="text-stone-600 mb-4 sm:mb-0">
          <span className="font-medium">{pagination.total}</span> artisan{pagination.total > 1 ? 's' : ''} trouvé{pagination.total > 1 ? 's' : ''}
        </p>
        
        <select 
          value={searchParams.sort || 'name'}
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search);
            params.set('sort', e.target.value);
            params.delete('page'); // Reset à la page 1 lors du changement de tri
            window.location.href = `?${params.toString()}`;
          }}
          className="px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="name">Trier par nom</option>
          <option value="recent">Plus récents</option>
          <option value="popular">Plus populaires</option>
        </select>
      </div>

      {/* Grille des artisans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisans.map((artisan) => (
          <ArtisanCard key={artisan.id} artisan={artisan} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination />
    </div>
  );
}