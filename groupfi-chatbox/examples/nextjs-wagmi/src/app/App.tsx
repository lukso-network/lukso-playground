import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useEffect, useState, useRef } from 'react'

// step1: import the groupfi-chatbox-sdk package.
import ChatboxSDK from 'groupfi-chatbox-sdk'
// step2: import the groupfi-chatbox-sdk style file.
import 'groupfi-chatbox-sdk/dist/esm/assets/style.css'

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  // step3: create a variable to track if the chatbox is ready.
  const [isChatboxReady, setIsChatboxReady] = useState(false)

  // step4: create a variable to store the wallet provider.
  const [walletProvider, setWalletProvider] = useState<
    undefined | null | unknown
  >(undefined)

  // step5: since getting provider is an asynchronous operation,
  // use a variable to store whether the provider is currently being getted.
  const isGettingWalletProvider = useRef(false)

  // Handle chatbox ready event
  useEffect(() => {
    const handleChatboxReady = () => {
      setIsChatboxReady(true)
      
      let recommendGroupIdList: string[] = []
      if (process.env.NEXT_PUBLIC_GROUPID_LIST) {
        recommendGroupIdList = JSON.parse(process.env.NEXT_PUBLIC_GROUPID_LIST)
        } 

      // step6: Once the chatbox is ready, set the recommended groups here.
      ChatboxSDK.request({
        method: 'setGroups',
        params: {
          includes: recommendGroupIdList.map((groupId) => ({ groupId }))
        }
      })
    }
    // Listen to chatbox ready event
    ChatboxSDK.events.on('chatbox-ready', handleChatboxReady)

    return () => {
      ChatboxSDK.events.off('chatbox-ready', handleChatboxReady)
    }
  }, [])

  // Try get wallet Provider from account connector
  useEffect(() => {
    const asyncTryGetWalletProvider = async () => {
      try {
        if (account.connector === undefined) {
          setWalletProvider(null)
        } else if (
          Object.hasOwnProperty.bind(account.connector)('getProvider')
        ) {
          isGettingWalletProvider.current = true
          const walletProvider = await account.connector?.getProvider()
          setWalletProvider(walletProvider)
          isGettingWalletProvider.current = false
        }
      } catch (error) {
        console.error('Failed to get wallet provider', error)
      }
    }
    asyncTryGetWalletProvider()
  }, [account.connector])

  // Call the loadChatbox api or the processWallet api based on the walletProvider.
  useEffect(() => {
    if (walletProvider === undefined) {
      return
    }

    const isWalletConnected = walletProvider !== null

    // step7: execute loadChatbox api or processWallet api
    // (1) If chatbox is not ready, execute the loadChatbox api.
    if (!isChatboxReady) {
      ChatboxSDK.loadChatbox({
        isWalletConnected,
        provider: walletProvider ?? undefined
      })
    } else {
      // (2) If chatbox is ready, execute processWallet api
      ChatboxSDK.processWallet({
        isWalletConnected,
        provider: walletProvider ?? undefined
      })
    }
  }, [walletProvider])

  useEffect(() => {
    if (
      !isGettingWalletProvider.current &&
      walletProvider &&
      isChatboxReady &&
      account.address !== undefined
    ) {
      // step7: specify the address for the chatbox to load.
      ChatboxSDK.processAccount({
        account: account.address
      })
    }
  }, [isChatboxReady, walletProvider, account.address])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Account</h2>
      <div className="mb-4">
        <p><strong>Status:</strong> {account.status}</p>
        <p><strong>Addresses:</strong> {JSON.stringify(account.addresses)}</p>
        <p><strong>Current address:</strong> {account.address}</p>
        <p><strong>ChainId:</strong> {account.chainId}</p>
      </div>

      {account.status === 'connected' && (
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      )}

      <h2 className="text-2xl font-bold mb-4">Connect</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {connector.name}
          </button>
        ))}
      </div>
      {status && <p><strong>Status:</strong> {status}</p>}
      {error && <p className="text-red-500"><strong>Error:</strong> {error.message}</p>}
    </div>
  )
}

export default App
