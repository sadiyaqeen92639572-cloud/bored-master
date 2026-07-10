import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://boredmaster.com'),
  title: 'What to Do When Bored: Fun Things to Do at Home, School, Work & with Friends',
  description: 'Need something to do when bored? Explore quick ideas for home, school, class, work, computer, night, or with friends. Fast, fun, and easy boredom cures.',
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'What to Do When Bored — Bored Master',
    description: 'Instant anti-boredom ideas for any situation. Filter by place, time, and mood.',
    type: 'website',
    url: 'https://boredmaster.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
