/**
 * FICHIER: src/components/features/artisans/SearchFilters.tsx
 * 
 * NOM: Composant Filtres de Recherche
 * 
 * DESCRIPTION:
 * Composant sidebar qui propose les différents filtres pour affiner la recherche
 * d'artisans : barre de recherche textuelle, filtres par métier, par région,
 * et autres critères. Met à jour l'URL pour maintenir l'état des filtres.
 * 
 * FONCTIONNALITÉS:
 * - Recherche textuelle par nom/métier
 * - Filtrage par métier (liste déroulante)
 * - Filtrage par région (liste déroulante)
 * - Bouton de réinitialisation des filtres
 * - Synchronisation avec l'URL
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Filter } from 'lucide-react';

// Types pour les options de filtres
interface FilterOptions {
  metiers: Array<{ value: string; label: string; count: number }>;
  regions: Array<{ value: string; label: string; count: number }>;
}

interface SearchParams {
  search?: string;
  metier?: string;
  region?: string;
  page?: string;
  sort?: 'name' | 'recent' | 'popular';
}

interface SearchFiltersProps {
  searchParams: SearchParams;
}

export default function SearchFilters({ searchParams }: SearchFiltersProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  
  // États locaux pour les filtres
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [selectedMetier, setSelectedMetier] = useState(searchParams.metier || '');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.region || '');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    metiers: [],
    regions: []
  });
  const [loading, setLoading] = useState(true);

  // Chargement des options de filtres depuis l'API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/artisans/filters');
        if (response.ok) {
          const data = await response.json();
          setFilterOptions(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des options de filtres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Mise à jour de l'URL avec les paramètres de recherche
  const updateURL = (newParams: Partial<SearchParams>) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    
    // Mise à jour des paramètres
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset de la page lors d'un changement de filtre
    if (Object.keys(newParams).some(key => key !== 'page')) {
      params.delete('page');
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handlers pour les différents filtres
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ search: searchTerm });
  };

  const handleMetierChange = (metier: string) => {
    setSelectedMetier(metier);
    updateURL({ metier });
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    updateURL({ region });
  };

  // Réinitialisation de tous les filtres
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedMetier('');
    setSelectedRegion('');
    router.push('/artisans', { scroll: false });
  };

  // Vérification s'il y a des filtres actifs
  const hasActiveFilters = searchTerm || selectedMetier || selectedRegion;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-stone-200 rounded"></div>
        <div className="space-y-3">
          <div className="h-4 bg-stone-200 rounded w-3/4"></div>
          <div className="h-10 bg-stone-200 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-stone-200 rounded w-2/3"></div>
          <div className="h-10 bg-stone-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barre de recherche textuelle */}
      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <label className="block text-sm font-medium text-stone-700">
          <Search className="w-4 h-4 inline mr-2" />
          Rechercher
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nom, métier, spécialité..."
            className="w-full px-3 py-2 pr-10 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                updateURL({ search: '' });
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
        >
          Rechercher
        </button>
      </form>

      {/* Filtre par métier */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-stone-700">
          <Filter className="w-4 h-4 inline mr-2" />
          Métier
        </label>
        <select
          value={selectedMetier}
          onChange={(e) => handleMetierChange(e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="">Tous les métiers</option>
          {filterOptions.metiers.map((metier) => (
            <option key={metier.value} value={metier.value}>
              {metier.label} ({metier.count})
            </option>
          ))}
        </select>
      </div>

      {/* Filtre par région */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-stone-700">
          Région
        </label>
        <select
          value={selectedRegion}
          onChange={(e) => handleRegionChange(e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="">Toutes les régions</option>
          {filterOptions.regions.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label} ({region.count})
            </option>
          ))}
        </select>
      </div>

      {/* Filtres supplémentaires */}
      <div className="border-t border-stone-200 pt-4 space-y-4">
        <h3 className="font-medium text-stone-900 text-sm">Filtres avancés</h3>
        
        {/* Certifications */}
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              onChange={(e) => {
                const params = new URLSearchParams(urlSearchParams.toString());
                if (e.target.checked) {
                  params.set('certified', 'true');
                } else {
                  params.delete('certified');
                }
                params.delete('page');
                router.push(`?${params.toString()}`, { scroll: false });
              }}
              checked={urlSearchParams.get('certified') === 'true'}
            />
            <span className="ml-2 text-sm text-stone-700">
              Artisans certifiés uniquement
            </span>
          </label>
        </div>

        {/* Disponibilité commandes */}
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              onChange={(e) => {
                const params = new URLSearchParams(urlSearchParams.toString());
                if (e.target.checked) {
                  params.set('available', 'true');
                } else {
                  params.delete('available');
                }
                params.delete('page');
                router.push(`?${params.toString()}`, { scroll: false });
              }}
              checked={urlSearchParams.get('available') === 'true'}
            />
            <span className="ml-2 text-sm text-stone-700">
              Disponibles pour commandes
            </span>
          </label>
        </div>

        {/* Avec photos uniquement */}
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              onChange={(e) => {
                const params = new URLSearchParams(urlSearchParams.toString());
                if (e.target.checked) {
                  params.set('with_photos', 'true');
                } else {
                  params.delete('with_photos');
                }
                params.delete('page');
                router.push(`?${params.toString()}`, { scroll: false });
              }}
              checked={urlSearchParams.get('with_photos') === 'true'}
            />
            <span className="ml-2 text-sm text-stone-700">
              Avec photos uniquement
            </span>
          </label>
        </div>
      </div>

      {/* Bouton de réinitialisation */}
      {hasActiveFilters && (
        <div className="border-t border-stone-200 pt-4">
          <button
            onClick={clearAllFilters}
            className="w-full px-4 py-2 text-stone-600 border border-stone-300 rounded-md hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-colors"
          >
            <X className="w-4 h-4 inline mr-2" />
            Effacer tous les filtres
          </button>
        </div>
      )}

      {/* Résumé des filtres actifs */}
      {hasActiveFilters && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-amber-800 mb-2">Filtres actifs :</h4>
          <div className="space-y-1">
            {searchTerm && (
              <div className="text-sm text-amber-700">
                Recherche : <span className="font-medium">"{searchTerm}"</span>
              </div>
            )}
            {selectedMetier && (
              <div className="text-sm text-amber-700">
                Métier : <span className="font-medium">
                  {filterOptions.metiers.find(m => m.value === selectedMetier)?.label || selectedMetier}
                </span>
              </div>
            )}
            {selectedRegion && (
              <div className="text-sm text-amber-700">
                Région : <span className="font-medium">
                  {filterOptions.regions.find(r => r.value === selectedRegion)?.label || selectedRegion}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}