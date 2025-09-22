'use client'

/**
 * PROVIDERS - src/components/providers.tsx
 * 
 * Description:
 * Centralise tous les providers React Context nécessaires à l'application.
 * Gère le thème, l'état global, et autres contextes partagés.
 */

import React from 'react'
import { ThemeProvider } from 'next-themes'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}