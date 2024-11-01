
'use client'

import { Buffer } from 'buffer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { WagmiProvider } from 'wagmi'
import { config } from './wagmi'
import dynamic from 'next/dynamic'

globalThis.Buffer = Buffer
const queryClient = new QueryClient()
const App = dynamic(() => import('./App'), { ssr: false })

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
)
}