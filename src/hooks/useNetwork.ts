import { useEffect } from 'react'

import NetInfo from '@react-native-community/netinfo'
import { OpenNetworkModal } from 'src/constants'
import { DiceStore } from 'src/store'

export const useNetwork = () => {
  useEffect(() => {
    const unsub = NetInfo.addEventListener(state => {
      if (state.isConnected === false && DiceStore.online) {
        OpenNetworkModal()
      }
    })
    return unsub
  }, [])
}
