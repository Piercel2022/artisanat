// ===================================================================================================
// FICHIER: components/layout/Container.tsx
// DESCRIPTION: Composant conteneur pour centrer et limiter la largeur du contenu
// BUT: Fournir une mise en page cohérente et responsive
// RÔLE: Wrapper utilisé pour centrer le contenu principal des pages
// ===================================================================================================

import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  padding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  className = '',
  padding = true
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';

  return (
    <div className={`mx-auto ${sizeClasses[size]} ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};
