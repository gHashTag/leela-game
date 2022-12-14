import React from 'react'

import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const CenterView = ({ children }) => {
  return <View style={styles.main}>{children}</View>
}

export { CenterView }
