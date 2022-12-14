import React from 'react'

import { Image, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { vs } from 'react-native-size-matters'

const page = StyleSheet.create({
  img: {
    width: vs(18),
    height: vs(18),
  },
})

interface ButtonEditT {
  onPress: () => void
  viewStyle?: StyleProp<ViewStyle>
}

const ButtonEdit = ({ onPress, viewStyle }: ButtonEditT) => {
  return (
    <TouchableOpacity onPress={onPress} style={viewStyle}>
      <Image style={page.img} source={require('./edit.png')} />
    </TouchableOpacity>
  )
}

export { ButtonEdit }
