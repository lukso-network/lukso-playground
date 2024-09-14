import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { MetaMaskProvider } from '@metamask/sdk-react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MetaMaskProvider
      debug={true}
      sdkOptions={{
        dappMetadata: {
          name: 'Example React Dapp',
          url: window.location.href
        }
        // Other options.
      }}
    >
      <App />
    </MetaMaskProvider>
  </StrictMode>
)
