import React from 'react'

import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import { observer } from 'mobx-react'
import { TouchableOpacity, View, useColorScheme } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScaledSheet, ms, s } from 'react-native-size-matters'
import { Tab } from 'src/components'
import { black, white } from 'src/constants'

export default observer(function TabBar({ state, navigation }: MaterialTopTabBarProps) {
  const { index, routes } = state
  const scheme = useColorScheme()
  const { bottom } = useSafeAreaInsets()

  const tabContainer = [
    container,
    {
      backgroundColor: scheme === 'dark' ? black : white,
      paddingBottom: bottom + s(10),
    },
  ]

  return (
    <View style={tabContainer}>
      {routes.map(({ name, key }, id) => {
        const isFocused = index === id
        return (
          <TouchableOpacity
            key={key}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: key,
                canPreventDefault: true,
              })

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate('MAIN', {
                  screen: name,
                  merge: true,
                })
              }
            }}
          >
            <Tab title={isFocused ? name : `${name}_DISABLE`} />
          </TouchableOpacity>
        )
      })}
    </View>
  )
})

const styles = ScaledSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: ms(10, 0.5),
    flexDirection: 'row',
  },
})

const { container } = styles
