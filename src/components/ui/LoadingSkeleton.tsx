/**
 * FICHIER: src/components/ui/LoadingSkeleton.tsx
 * 
 * NOM: Composant Skeleton de Chargement
 * 
 * DESCRIPTION:
 * Composant réutilisable qui affiche des placeholders animés pendant le chargement
 * des données. Supporte différents types de layouts (texte, grille, galerie, etc.)
 */

import React from 'react';

interface LoadingSkeletonProps {
  type: 'text-content' | 'grid' | 'gallery' | 'testimonials' | 'form' | 'artisan-grid';
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, className = '' }) => {
  const baseClasses = 'animate-pulse bg-stone-200 rounded';

  const renderSkeleton = () => {
    switch (type) {
      case 'text-content':
        return (
          <div className={`space-y-4 ${className}`}>
            <div className={`${baseClasses} h-8 w-3/4`} />
            <div className={`${baseClasses} h-4 w-full`} />
            <div className={`${baseClasses} h-4 w-5/6`} />
            <div className={`${baseClasses} h-4 w-4/5`} />
            <div className={`${baseClasses} h-4 w-3/4`} />
          </div>
        );

      case 'grid':
        return (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className={`${baseClasses} h-48 w-full`} />
                <div className={`${baseClasses} h-4 w-3/4`} />
                <div className={`${baseClasses} h-4 w-1/2`} />
              </div>
            ))}
          </div>
        );

      case 'gallery':
        return (
          <div className={`space-y-4 ${className}`}>
            <div className={`${baseClasses} h-8 w-1/3 mb-6`} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`${baseClasses} aspect-square w-full`} />
              ))}
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className={`space-y-6 ${className}`}>
            <div className={`${baseClasses} h-8 w-1/3 mb-6`} />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-stone-200">
                <div className="flex items-start space-x-4">
                  <div className={`${baseClasses} w-12 h-12 rounded-full flex-shrink-0`} />
                  <div className="flex-1 space-y-2">
                    <div className={`${baseClasses} h-4 w-1/4`} />
                    <div className={`${baseClasses} h-4 w-full`} />
                    <div className={`${baseClasses} h-4 w-3/4`} />
                    <div className={`${baseClasses} h-4 w-1/2`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'form':
        return (
          <div className={`space-y-4 ${className}`}>
            <div className={`${baseClasses} h-10 w-full`} />
            <div className={`${baseClasses} h-10 w-full`} />
            <div className={`${baseClasses} h-24 w-full`} />
            <div className={`${baseClasses} h-10 w-32`} />
          </div>
        );

      case 'artisan-grid':
        return (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden border border-stone-200">
                <div className={`${baseClasses} h-64 w-full`} />
                <div className="p-6 space-y-3">
                  <div className={`${baseClasses} h-6 w-3/4`} />
                  <div className={`${baseClasses} h-4 w-1/2`} />
                  <div className={`${baseClasses} h-4 w-full`} />
                  <div className={`${baseClasses} h-4 w-2/3`} />
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className={`${baseClasses} h-20 w-full ${className}`} />
        );
    }
  };

  return <div className="animate-pulse">{renderSkeleton()}</div>;
};

export default LoadingSkeleton;