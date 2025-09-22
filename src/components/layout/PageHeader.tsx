// ===================================================================================================
// FICHIER: components/layout/PageHeader.tsx
// DESCRIPTION: Composant d'en-tête de page avec titre et actions
// BUT: Fournir une structure cohérente pour les en-têtes de page
// RÔLE: Composant utilisé en haut des pages de contenu pour afficher titre et actions
// ===================================================================================================

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-gray-600 max-w-2xl">
                  {description}
                </p>
              )}
            </div>
            {children && (
              <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-shrink-0">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
