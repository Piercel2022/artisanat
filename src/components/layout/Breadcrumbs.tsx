// ===================================================================================================
// FICHIER: components/layout/Breadcrumbs.tsx
// DESCRIPTION: Composant de fil d'Ariane pour la navigation hiérarchique
// BUT: Afficher le chemin de navigation actuel et permettre la navigation rapide
// RÔLE: Composant d'aide à la navigation utilisé dans les pages internes
// ===================================================================================================

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  showHome = true
}) => {
  const allItems = showHome
    ? [{ label: 'Accueil', href: '/' }, ...items]
    : items;

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" />
            )}
            
            {item.current || !item.href ? (
              <span className="text-gray-900 font-medium flex items-center">
                {index === 0 && showHome && <Home className="w-4 h-4 mr-1" />}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
              >
                {index === 0 && showHome && <Home className="w-4 h-4 mr-1" />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};