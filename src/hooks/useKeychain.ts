import { useCallback, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNetInfo } from '@react-native-community/netinfo'
import auth from '@react-native-firebase/auth'
import { useFocusEffect, useLinkTo } from '@react-navigation/native'
import * as Keychain from 'react-native-keychain'

import { useTypedNavigation } from './useTypedNavigation'

import { captureException } from '../constants'
import { onSignIn } from '../screens/helper'

export const useKeychain = () => {
  const { navigate } = useTypedNavigation()
  const [loading, setLoading] = useState<boolean>(true)
  const { isConnected } = useNetInfo()
  const linkTo = useLinkTo()
  const key = async (): Promise<void> => {
    try {
      const credentials = await Keychain.getInternetCredentials('auth')
      if (credentials && isConnected) {
        const { username, password } = credentials
        await auth()
          .signInWithEmailAndPassword(username, password)
          .then(async user => {
            await onSignIn(user.user, true, linkTo)
          })
      } else if (isConnected !== null) {
        return Promise.reject()
      }
      isConnected !== null && setLoading(false)
    } catch (err) {
      captureException(err)
      isConnected !== null && setLoading(false)
      return Promise.reject()
    }
  }

  const checkGame = async () => {
    const init = await AsyncStorage.getItem('@init')
    if (init === 'true') {
      navigate('MAIN')
    } else {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      key().catch(checkGame)
    }, [isConnected]),
  )
  return { loading }
}