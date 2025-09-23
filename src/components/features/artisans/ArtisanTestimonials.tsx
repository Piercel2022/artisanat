/**
 * ArtisanTestimonials.tsx
 * 
 * Description: Composant d'affichage des témoignages clients pour un artisan spécifique
 * 
 * Rôle: 
 * - Affiche les avis et témoignages laissés par les clients
 * - Présente les notes/étoiles et commentaires
 * - Gère l'affichage paginé des témoignages
 * - Permet le tri par date/note
 * 
 * Relations dans l'application:
 * - Utilisé dans: pages/artisans/[slug]/page.tsx (profil artisan)
 * - Dépend de: @/types/artisan pour les types Testimonial
 * - Utilise: @/components/ui pour les composants de base (Card, Rating, Button)
 * - Connecté à: API testimonials pour récupérer les avis
 * - Lié à: système d'authentification pour permettre aux clients connectés de laisser des avis
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Star, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { button } from 'framer-motion/client';

// Types pour les témoignages
interface Testimonial {
  id: string;
  clientName: string;
  clientAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  productOrdered?: string;
  verified: boolean;
}

interface ArtisanTestimonialsProps {
  artisanId: string;
  artisanSlug: string;
}

export default function ArtisanTestimonials({ artisanId, artisanSlug }: ArtisanTestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');
  const [averageRating, setAverageRating] = useState(0);
  const [totalTestimonials, setTotalTestimonials] = useState(0);

  const testimonialsPerPage = 6;

  // Chargement des témoignages depuis l'API
  useEffect(() => {
    fetchTestimonials();
  }, [artisanId, currentPage, sortBy]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/testimonials?artisanId=${artisanId}&page=${currentPage}&limit=${testimonialsPerPage}&sortBy=${sortBy}`
      );
      const data = await response.json();
      
      setTestimonials(data.testimonials);
      setTotalPages(data.totalPages);
      setAverageRating(data.averageRating);
      setTotalTestimonials(data.totalCount);
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rendu des étoiles pour la notation
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-100 pb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      {/* En-tête de la section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Avis clients ({totalTestimonials})
          </h2>
          {totalTestimonials > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {renderStars(averageRating)}
                <span className="text-lg font-semibold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                Basé sur {totalTestimonials} avis
              </span>
            </div>
          )}
        </div>

        {/* Tri des témoignages */}
        {totalTestimonials > 0 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'rating')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="recent">Plus récents</option>
            <option value="rating">Mieux notés</option>
          </select>
        )}
      </div>

      {/* Liste des témoignages */}
      {testimonials.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun avis pour le moment
          </h3>
          <p className="text-gray-500">
            Soyez le premier à laisser un avis sur cet artisan !
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="border-b border-gray-100 pb-6 last:border-b-0"
            >
              <div className="flex items-start gap-4">
                {/* Avatar du client */}
                <div className="flex-shrink-0">
                  {testimonial.clientAvatar ? (
                    <img
                      src={testimonial.clientAvatar}
                      alt={testimonial.clientName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Contenu du témoignage */}
                <div className="flex-1">
                  {/* Informations du client */}
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.clientName}
                    </h4>
                    {testimonial.verified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Achat vérifié
                      </span>
                    )}
                  </div>

                  {/* Note et date */}
                  <div className="flex items-center gap-4 mb-3">
                    {renderStars(testimonial.rating, 'sm')}
                    <span className="text-sm text-gray-500">
                      {formatDate(testimonial.date)}
                    </span>
                  </div>

                  {/* Produit commandé */}
                  {testimonial.productOrdered && (
                    <p className="text-sm text-gray-600 mb-2">
                      Produit: <span className="font-medium">{testimonial.productOrdered}</span>
                    </p>
                  )}

                  {/* Commentaire */}
                  <p className="text-gray-700 leading-relaxed">
                    {testimonial.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 text-sm font-medium rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}