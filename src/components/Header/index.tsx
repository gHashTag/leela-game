import React, { memo } from 'react'

import { useTheme } from '@react-navigation/native'
import { Platform, TouchableOpacity, View } from 'react-native'
import Emoji from 'react-native-emoji'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScaledSheet, ms, mvs, s, vs } from 'react-native-size-matters'

import { HeaderMessage, Text } from '../'
import { navigate } from '../../constants'
const isIos = Platform.OS === 'ios'

interface HeaderT {
  title?: string
  iconLeft?: string | null
  iconRight?: string | null
  onPress?: () => void | null
  onPressRight?: () => void
  iconLeftOpacity?: number
  textAlign?: 'center' | 'auto' | 'left' | 'right' | 'justify'
  children?: React.ReactNode
  displayStatus?: boolean
}

const Header = memo<HeaderT>(
  ({
    title,
    iconLeft = ':information_source:',
    iconRight = ':books:',
    onPress = () => {
      navigate('RULES_SCREEN')
    },
    onPressRight = () => {
      navigate('PLANS_SCREEN')
    },
    iconLeftOpacity = 1,
    children,
    textAlign,
    displayStatus,
  }) => {
    const {
      colors: { background },
    } = useTheme()

    const { top } = useSafeAreaInsets()
    const alignItems = children ? 'flex-start' : 'center'
    const marginTop = children ? s(2) : 0
    const backgroundColor = children ? 'transparent' : background

    return (
      <View style={[container, { paddingTop: top, alignItems, backgroundColor }]}>
        {iconLeft && (
          <TouchableOpacity style={{ opacity: iconLeftOpacity }} onPress={onPress}>
            <Emoji name={iconLeft} style={leftIconStyle} />
          </TouchableOpacity>
        )}
        <View style={flexOne}>
          {title && !displayStatus && (
            <Text
              numberOfLines={1}
              h={'h2'}
              title={title}
              textStyle={[titleStyle, { textAlign, marginTop }]}
            />
          )}
          {(children || displayStatus) && (
            <View style={[childrenStyle, !title && { marginTop }]}>
              {displayStatus && !children && <HeaderMessage />}
              {children}
            </View>
          )}
        </View>
        {iconRight ? (
          <TouchableOpacity onPress={onPressRight}>
            <Emoji name={iconRight} style={rightIconStyle} />
          </TouchableOpacity>
        ) : (
          iconLeft && <View style={rightViewStyle} />
        )}
      </View>
    )
  },
)

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: mvs(1, 0.4),
    zIndex: 20,
  },
  leftIconStyle: {
    fontSize: isIos ? ms(26, 0.5) : ms(22, 0.5),
    textAlign: 'center',
    alignItems: 'center',
    paddingTop: s(2),
    marginHorizontal: s(8),
    marginVertical: s(5),
  },
  rightIconStyle: {
    fontSize: isIos ? ms(30, 0.5) : ms(28, 0.5),
    textAlign: 'center',
    alignItems: 'center',
    marginHorizontal: s(8),
    marginVertical: s(5),
  },
  rightViewStyle: {
    width: isIos ? s(60) : s(44),
  },
  titleStyle: {
    fontSize: vs(18),
  },
  childrenStyle: {},
  flexOne: { flex: 1 },
})

const {
  container,
  leftIconStyle,
  rightIconStyle,
  rightViewStyle,
  titleStyle,
  childrenStyle,
  flexOne,
} = styles

export { Header }
