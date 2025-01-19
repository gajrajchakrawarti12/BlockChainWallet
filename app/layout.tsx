import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BlockChain Wallet',
  description: 'Created by Gajraj Chakrawarti',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
