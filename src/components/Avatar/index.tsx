import React, { memo } from 'react'

import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import FastImage from 'react-native-fast-image'
import { s } from 'react-native-size-matters'
import Spinner from 'react-native-spinkit'

import { secondary } from '../../constants'

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    borderRadius: s(130),
    overflow: 'hidden',
  },
  xLarge: {
    marginLeft: 1,
    width: s(120),
    height: s(120),
    borderRadius: s(130),
  },
  large: {
    marginLeft: 1,
    width: s(75),
    height: s(75),
    borderRadius: s(75),
  },
  medium: {
    width: s(50),
    height: s(50),
    borderRadius: s(50),
  },
  small: {
    width: s(36),
    height: s(36),
    borderRadius: s(36),
  },
})

type sizeType = 'xLarge' | 'large' | 'medium' | 'small'

interface AvatarT {
  loading: boolean
  size?: sizeType
  uri?: string
  viewStyle?: StyleProp<ViewStyle>
}

export const Avatar = memo<AvatarT>(({ loading, uri, size = 'large', viewStyle }) => {
  const { container } = styles
  return (
    <View style={[container, viewStyle]}>
      {loading ? (
        <Spinner size={styles[size].height} type="Pulse" color={secondary} />
      ) : !uri ? (
        <FastImage style={styles[size]} source={require('./pickaface.png')} />
      ) : (
        <FastImage
          style={styles[size]}
          source={{ uri, priority: FastImage.priority.high }}
        />
      )}
    </View>
  )
})

interface PressableAvatarT extends AvatarT {
  onPress?: () => void
}

export const PressableAvatar = ({ onPress, ...props }: PressableAvatarT) => {
  return (
    <Pressable onPress={onPress}>
      <Avatar {...props} />
    </Pressable>
  )
}
