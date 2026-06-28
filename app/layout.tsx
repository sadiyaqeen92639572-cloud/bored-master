import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'What to Do When Bored: Fun Things to Do at Home, School, Work & with Friends',
  description: 'Need something to do when bored? Explore quick ideas for home, school, class, work, computer, night, or with friends. Fast, fun, and easy boredom cures.',
  openGraph: {
    title: 'What to Do When Bored — Bored Master',
    description: 'Instant anti-boredom ideas for any situation. Filter by place, time, and mood.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
