import React from 'react'

import { KeyboardAvoidingView, StyleSheet } from 'react-native'

import { KeyboardContainerProps } from '.'

export const KeyboardContainer = ({
  children,
  style,
  ...props
}: KeyboardContainerProps) => {
  return (
    <KeyboardAvoidingView behavior="height" style={[styles.flexOne, style]} {...props}>
      {children}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
})
