import {
  disconnect,
  watchAccount,
  getAccount,
  GetAccountResult,
  PublicClient
} from '@wagmi/core'
import { rabbyKit } from './rabbykit.ts'
import { useEffect, useState, useRef } from 'react'

// step1: import the groupfi-chatbox-sdk package.
import ChatboxSDK from 'groupfi-chatbox-sdk'
// step2: import the groupfi-chatbox-sdk style file.
import 'groupfi-chatbox-sdk/dist/esm/assets/style.css'

function App() {
  const [account, setAccount] = useState<
    GetAccountResult<PublicClient> | undefined
  >(getAccount())

  const isConnected = account?.isConnected

  console.log('account', account)

  useEffect(() => {
    // Subscribe to account changes
    const unwatch = watchAccount((data) => {
      setAccount(data)
    })

    return unwatch
  }, [])

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
      try {
        recommendGroupIdList = JSON.parse(
          import.meta.env.VITE_RECOMMEND_GROUPID_LIST
        )
      } catch (error) {
        console.error('Failed to parse recommend groupId list.', error)
      }

      //step6: Once the chatbox is ready, set the recommended groups here.
      ChatboxSDK.request({
        method: 'setGroups',
        params: {
          includes: recommendGroupIdList.map((groupId) => ({
            groupId
          }))
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
    if (account === undefined) {
      return
    }

    const asyncTryGetWalletProvider = async () => {
      try {
        if (account.connector === undefined) {
          setWalletProvider(null)
          return
        }
        const options = account.connector.options
        if (Object.hasOwnProperty.bind(options)('getProvider')) {
          isGettingWalletProvider.current = true
          const walletProvider = await options.getProvider()
          setWalletProvider(walletProvider)
          isGettingWalletProvider.current = false
          return
        }
      } catch (error) {
        console.error('Failed to get wallet provider', error)
      }
    }
    asyncTryGetWalletProvider()
  }, [account?.connector])

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
      account?.address !== undefined
    ) {
      // step7: specify the address for the chatbox to load.
      ChatboxSDK.processAccount({
        account: account.address
      })
    }
  }, [isChatboxReady, walletProvider, account?.address])

  return (
    <div>
      <button
        onClick={() => {
          if (isConnected) {
            disconnect()
          } else {
            rabbyKit.open()
          }
        }}
      >
        {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
      </button>

      <div>address: {account?.address}</div>
    </div>
  )
}

export default App
