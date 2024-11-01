import { useSDK } from '@metamask/sdk-react'
import { useEffect, useState } from 'react'

// import the groupfi-chatbox-sdk package.
import ChatboxSDK from 'groupfi-chatbox-sdk'
// import the groupfi-chatbox-sdk style file.
import 'groupfi-chatbox-sdk/dist/esm/assets/style.css'

function App() {
  const [account, setAccount] = useState<string>()
  const isConnected = account !== undefined
  const { sdk, provider } = useSDK()

  const handleAccountsChanged = (accounts: unknown) => {
    setAccount((accounts as string[])?.[0])
  }

  const connect = async () => {
    try {
      const accounts = await sdk?.connect()
      setAccount(accounts?.[0])

      provider?.on('accountsChanged', handleAccountsChanged)
    } catch (err) {
      console.warn('failed to connect..', err)
    }
  }

  const disconnect = async () => {
    try {
      await sdk?.terminate()
      setAccount(undefined)
      provider?.removeAllListeners()
    } catch (err) {
      console.warn('failed to disconnect..', err)
    }
  }

  // create a variable to track if the chatbox is ready.
  const [isChatboxReady, setIsChatboxReady] = useState(false)

  // create a variable to store the wallet provider.
  const [walletProvider, setWalletProvider] = useState<
    undefined | null | unknown
  >(undefined)

  // Handle chatbox ready event
  useEffect(() => {
    const handleChatboxReady = () => {
      setIsChatboxReady(true)

      // step5: Once the chatbox is ready, set the recommended groups and announcement groups here.
      ChatboxSDK.request({
        method: 'setGroups',
        params: {
          includes: [
            {
              groupId:
                'groupfiadmin7ef7bd5f49843d162c869edc56c59ef73e123a872563cdca1f612267696ae3df'
            },
            {
              groupId:
                'groupfiStakingverseAppreciationNFTc48fcc996ad2a9d28824f0b57c8f3b6128ac174539924565f93ecd79d17f6a8c'
            }
          ],
          announcement: [
            {
              groupId:
                'groupfiadmin7ef7bd5f49843d162c869edc56c59ef73e123a872563cdca1f612267696ae3df'
            }
          ]
        }
      })
    }
    // Listen to chatbox ready event
    ChatboxSDK.events.on('chatbox-ready', handleChatboxReady)

    return () => {
      ChatboxSDK.events.off('chatbox-ready', handleChatboxReady)
    }
  }, [])

  // Decide the walletProvider based on whether the account is undefined.
  useEffect(() => {
    if (!account) {
      setWalletProvider(null)
    } else {
      setWalletProvider(provider)
    }
  }, [account])

  // Call the loadChatbox api or the processWallet api based on the walletProvider.
  useEffect(() => {
    if (walletProvider === undefined) {
      return
    }
    const isWalletConnected = account !== undefined
    // If chatbox is not ready, execute the loadChatbox api.
    if (!isChatboxReady) {
      ChatboxSDK.loadChatbox({
        isWalletConnected,
        provider: walletProvider ?? undefined
      })
    } else {
      // If chatbox is ready, execute processWallet api
      ChatboxSDK.processWallet({
        isWalletConnected,
        provider: walletProvider ?? undefined
      })
    }
  }, [walletProvider])

  useEffect(() => {
    if (isChatboxReady && walletProvider && account) {
      // specify the address for the chatbox to load.
      ChatboxSDK.processAccount({
        account: account
      })
    }
  }, [isChatboxReady, walletProvider, account])

  return (
    <div className="App">
      <button
        style={{ padding: 10, margin: 10 }}
        onClick={isConnected ? disconnect : connect}
      >
        {isConnected ? 'Disconnect MetaMask' : 'Connect MetaMask'}
      </button>

      <div>account: {account ?? ''}</div>
    </div>
  )
}

export default App
