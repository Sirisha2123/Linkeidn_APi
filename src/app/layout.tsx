import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LinkedIn Profile Fetcher',
  description: 'Fetch and display LinkedIn profile information',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
