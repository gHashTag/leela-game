import React, { useEffect } from 'react'

import { BlurView } from '@react-native-community/blur'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, StyleSheet, View } from 'react-native'
import prompt from 'react-native-prompt-android'
import { s, vs } from 'react-native-size-matters'
import { ButtonWithIcon } from 'src/components'
import { openUrl } from 'src/constants'
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
  const { buttonColor, imgUrl, eventUrl } = OnlinePlayer.store.poster || {}

  const { t } = useTranslation()

  const showSecondPrompt = (title: string) => {
    prompt(
      'Notification body',
      undefined,
      [{ text: 'Send', onPress: text => sendInviteNotification({ text, title }) }],
      {
        type: 'default',
        cancelable: true,
      },
    )
  }

  const onSendAll = () => {
    prompt(
      'Notification title',
      undefined,
      [{ text: 'Next', onPress: title => showSecondPrompt(title) }],
      {
        type: 'default',
        cancelable: true,
      },
    )
  }

  return (
    <ImageBackground resizeMode="cover" source={{ uri: imgUrl }} style={img}>
      <View style={[styles.btnMoreContainer, secondBtnVisible && styles.lessBottom]}>
        <BlurView blurType="light" blurAmount={10} style={styles.blurBackground} />
        <ButtonWithIcon
          title={t('assign')}
          color={buttonColor || '#AA6100'}
          h="h6"
          viewStyle={styles.btnMore}
          onPress={() => openUrl(eventUrl)}
        />
        {secondBtnVisible && (
          <ButtonWithIcon
            title="Send a notification to everyone"
            color={buttonColor || '#AA6100'}
            h="h6"
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
