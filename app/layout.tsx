import type { Metadata } from 'next'
import './globals.css'
import CustomCursor from '@/app/components/CustomCursor'
import ParticleBackground from '@/app/components/ParticleBackground'

export const metadata: Metadata = {
  title: 'Fitnest Health Club | Lahore',
  description: 'Transform your body and mind at Fitnest Health Club, Model Town Lahore.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        <ParticleBackground />
        {children}
      </body>
    </html>
  )
}