import React, { useEffect, useState } from 'react'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { s, vs } from 'react-native-size-matters'
import {
  AppContainer,
  Button,
  CenterView,
  IconLeela,
  Loading,
  Space,
  Text,
} from 'src/components'
import { app } from 'src/context/app'
import { RootStackParamList } from 'src/types'

type SelectPlayersScreenT = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SELECT_PLAYERS_SCREEN'>
}

const WelcomeScreen = observer(({ navigation }: SelectPlayersScreenT) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tryLoadUser = async () => {
      try {
        setLoading(true)
        const creds = await app.getSecretCredentials()
        await app.tryLoadUserByCredentials(creds)
      } catch (error) {
        console.log('🚀 - error', error)
      }
      setLoading(false)
    }
    tryLoadUser()
  }, [])

  const _onPress = () => {
    navigation.navigate('HELLO')
  }

  return (
    <AppContainer enableBackgroundBottomInsets enableBackgroundTopInsets iconLeft={null}>
      {loading ? (
        <Loading />
      ) : (
        <CenterView>
          <IconLeela />
          <Space height={s(30)} />
          <Text h={'h1'} title={t('gameMode')} />
          <Space height={s(30)} />
          <Button title={t('online')} onPress={_onPress} />
          <Space height={vs(10)} />
          <Text h={'h5'} title={t('or')} textStyle={styles.h6} />
          <Space height={vs(15)} />
          <Button
            title={t('offline')}
            onPress={() => navigation.navigate('SELECT_PLAYERS_SCREEN')}
          />
          <Space height={vs(120)} />
        </CenterView>
      )}
    </AppContainer>
  )
})

const styles = StyleSheet.create({
  h6: { alignSelf: 'center' },
})

export { WelcomeScreen }
