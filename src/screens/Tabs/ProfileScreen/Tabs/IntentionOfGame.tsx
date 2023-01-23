import React, { useContext } from 'react'

import { observer } from 'mobx-react'
import { StyleSheet, View } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import { s } from 'react-native-size-matters'
import { ButtonEdit, Space, Text } from 'src/components'
import { useTypedNavigation } from 'src/hooks'
import { TabContext } from 'src/screens/Tabs/ProfileScreen/TabContext'
import { OnlinePlayer } from 'src/store'

export const IntentionOfGame = observer(() => {
  const { navigate } = useTypedNavigation()
  const { headerGesture } = useContext(TabContext) as any
  const intention = OnlinePlayer.store.intention

  const handleEdit = () => {
    navigate('CHANGE_INTENTION_SCREEN', { prevIntention: intention })
  }

  return (
    <GestureDetector gesture={headerGesture}>
      <View style={container}>
        <Text title={intention ?? ''} h="h5" />
        <Space height={5} />
        <ButtonEdit viewStyle={btnEdit} onPress={handleEdit} />
        <Space height={5} />
      </View>
    </GestureDetector>
  )
})

const styles = StyleSheet.create({
  container: {
    padding: s(10),
    flex: 1,
  },
  btnEdit: {
    alignSelf: 'flex-end',
  },
})

const { container, btnEdit } = styles
