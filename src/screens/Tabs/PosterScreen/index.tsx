import React, { useCallback, useEffect } from 'react'

import { useFocusEffect } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native'
import prompt from 'react-native-prompt-android'
import { s, vs } from 'react-native-size-matters'
import { ButtonWithIcon } from 'src/components'
import { isIos, openUrl, primary } from 'src/constants'
import { DiceStore, OnlinePlayer, sendInviteNotification } from 'src/store'
import { RootTabParamList } from 'src/types'

type navigation = NativeStackNavigationProp<RootTabParamList, 'TAB_BOTTOM_4'>

type PosterScreenT = {
  navigation: navigation
}

const PosterScreen = observer(({}: PosterScreenT) => {
  useEffect(() => {
    OnlinePlayer.getPoster()
  }, [])

  const secondBtnVisible = DiceStore.online && OnlinePlayer.store.status === 'Admin'
  const { buttonColor, eventUrl } = OnlinePlayer.store.poster || {}
  const isDark = useColorScheme() === 'dark'
  const { t } = useTranslation()

  const showSecondPrompt = (title: string) => {
    if (isIos) {
      Alert.prompt('Notification body', undefined, [
        { text: t('actions.cancel'), style: 'cancel' },
        {
          text: t('actions.send'),
          onPress: text => sendInviteNotification({ text: text ?? '', title }),
        },
      ])
    } else {
      prompt(
        'Notification body',
        undefined,
        [
          { text: t('actions.cancel'), style: 'cancel' },
          {
            text: t('actions.send'),
            onPress: text => sendInviteNotification({ text, title }),
          },
        ],
        {
          type: 'default',
          cancelable: true,
        },
      )
    }
  }

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content')
      return () => {
        !isDark && StatusBar.setBarStyle('dark-content')
      }
    }, [isDark]),
  )

  const onSendAll = () => {
    if (isIos) {
      Alert.prompt('Notification title', undefined, [
        { text: t('actions.cancel'), style: 'cancel' },
        { text: t('actions.confirm'), onPress: title => showSecondPrompt(title ?? '') },
      ])
    } else {
      prompt(
        'Notification title',
        undefined,
        [
          { text: t('actions.cancel'), style: 'cancel' },
          { text: t('actions.confirm'), onPress: title => showSecondPrompt(title) },
        ],
        {
          type: 'default',
          cancelable: true,
        },
      )
    }
  }

  return (
    <ImageBackground
      resizeMode="cover"
      loadingIndicatorSource={require('../../../../assets/images/poster.jpeg')}
      source={require('../../../../assets/images/poster.jpeg')}
      style={img}
    >
      <View style={[styles.btnMoreContainer, secondBtnVisible && styles.lessBottom]}>
        {/* <BlurView blurType="light" blurAmount={10} style={styles.blurBackground} /> */}
        <ButtonWithIcon
          title="Запись на игру"
          color={buttonColor || primary}
          h="h13"
          viewStyle={styles.btnMore}
          onPress={() => openUrl(eventUrl)}
        />
        {secondBtnVisible && (
          <ButtonWithIcon
            title="Send a notification to everyone"
            color={buttonColor || primary}
            h="h13"
            viewStyle={styles.btnMore}
            onPress={onSendAll}
          />
        )}
      </View>
    </ImageBackground>
  )
})

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  img: {
    flex: 1,
    resizeMode: 'cover',
  },
  btnMore: {
    margin: s(5),
    alignSelf: 'center',
  },
  btnMoreContainer: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: s(10),
    bottom: vs(82),
    overflow: 'hidden',
    textAlign: 'center',
  },
  blurBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    opacity: 0.7,
    borderRadius: s(10),
    overflow: 'hidden',
  },
  lessBottom: {
    bottom: vs(42),
  },
})

const { img } = styles

export { PosterScreen }
