// ===================================================================================================
// FICHIER: components/layout/LoadingSpinner.tsx
// DESCRIPTION: Composant d'indicateur de chargement
// BUT: Afficher un état de chargement pendant les opérations asynchrones
// RÔLE: Composant d'interface utilisé pour indiquer un état de chargement
// ===================================================================================================

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  centered?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
  centered = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const spinner = (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );

  if (centered) {
    return (
      <div className="flex justify-center items-center p-8">
        {spinner}
      </div>
    );
  }

  return spinner;
};
