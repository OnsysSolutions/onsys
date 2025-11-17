'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from './ui/sonner'
import { TooltipProvider } from './ui/tooltip'
import { PropsWithChildren } from 'react'

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="ui-theme"
      value={{
        light: 'light',
        dark: 'dark',
      }}
    >
      <TooltipProvider>
        {children}
        <Toaster position="bottom-right" richColors />
      </TooltipProvider>
    </ThemeProvider>
  )
}
