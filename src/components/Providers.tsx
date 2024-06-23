"use client"

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


// Création d'une instance de QueryClient
const queryClient = new QueryClient()


// Fournisseur de thème pour les composants de l'application
const Providers = ({ children, ...props }: ThemeProviderProps) => {

  // Rendu du composant Providers
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        {...props}
      >
        <SessionProvider>{children}</SessionProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  )
}

export default Providers
