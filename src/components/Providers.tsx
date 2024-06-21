"use client"

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"


// Fournisseur de thème pour les composants de l'application
const Providers = ({ children, ...props }: ThemeProviderProps) => {

  // Rendu du composant Providers
  return (
    <NextThemesProvider attribute='class' defaultTheme='system' enableSystem>
      <SessionProvider>{children}</SessionProvider>
    </NextThemesProvider>
  )
}

export default Providers
