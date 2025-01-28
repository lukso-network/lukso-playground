import { configureChains, createConfig, InjectedConnector } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'
import { publicProvider } from '@wagmi/core/providers/public'

import { createModal } from '@rabby-wallet/rabbykit'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
  webSocketPublicClient
})

export const rabbyKit = createModal({
  chains,
  wagmi: config,
  projectId: '58a22d2bc1c793fc31c117ad9ceba8d9',
  appName: 'RabbyKit example',
  showWalletConnect: false
})
