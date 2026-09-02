'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      // Mismo lenguaje que las cards y los botones: 8px de radio, borde gris
      // del diseno y el verde del sistema para el icono de exito.
      toastOptions={{
        classNames: {
          toast:
            'rounded-[8px] border border-[#cfd6dc] bg-[#fefefe] text-[#001625] text-sm font-medium shadow-[0_8px_24px_rgba(0,22,37,0.10)]',
          description: 'text-[#868992]',
          success: '[&_[data-icon]]:text-primary',
          error: '[&_[data-icon]]:text-destructive',
        },
      }}
      style={
        {
          '--normal-bg': '#fefefe',
          '--normal-text': '#001625',
          '--normal-border': '#cfd6dc',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
