import React from 'react'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { vs } from 'react-native-size-matters'
import {
  AppContainer,
  CenterView,
  HeaderMaster,
  OwnTabView,
  SecondaryTab,
  Space,
  Spin,
} from 'src/components'
import { OnlinePlayer } from 'src/store'
import { RootStackParamList, RootTabParamList } from 'src/types'

import { TabContextProvider } from './TabContext'
import { HistoryScene, IntentionOfGame, ReportsScene } from './Tabs'

type ProfileScreenT = {
  navigation: NativeStackNavigationProp<
    RootTabParamList & RootStackParamList,
    'TAB_BOTTOM_3'
  >
}

const ProfileScreen = observer(({ navigation }: ProfileScreenT) => {
  const { width: W, height: H } = useWindowDimensions()
  const { t } = useTranslation()

  const tabViewWidth = W * 0.96

  const { avatar, plan, firstName, lastName } = OnlinePlayer.store

  return (
    <AppContainer
      iconRight={':books:'}
      iconLeft={':information_source:'}
      title={t('profile')}
      textAlign="center"
    >
      <TabContextProvider>
        {({ tabViewH, screenStyle, headerGesture }: any) => (
          <Animated.View style={screenStyle}>
            {OnlinePlayer.store.loadingProf ? (
              <CenterView>
                <Spin centered />
                <Space height={H * 0.5} />
              </CenterView>
            ) : (
              <View style={page.container}>
                <HeaderMaster
                  avatar={avatar ?? ''}
                  plan={plan}
                  firstName={firstName}
                  lastName={lastName}
                  editable
                  onPressName={() =>
                    navigation.navigate('USER_EDIT', { firstName, lastName })
                  }
                />
                <Space height={vs(5)} />
                <OwnTabView
                  renderTabBar={props => (
                    <GestureDetector gesture={headerGesture}>
                      <SecondaryTab {...props} />
                    </GestureDetector>
                  )}
                  width={tabViewWidth}
                  screens={[
                    { key: 'reports', title: t('reports'), Scene: ReportsScene },
                    { key: 'history', title: t('history'), Scene: HistoryScene },
                    {
                      key: 'intentionOfGame',
                      title: t('intention'),
                      Scene: IntentionOfGame,
                    },
                  ]}
                  style={[page.tabContainer, { height: tabViewH }]}
                />
              </View>
            )}
          </Animated.View>
        )}
      </TabContextProvider>
    </AppContainer>
  )
})

const page = StyleSheet.create({
  tabContainer: {},
  container: {
    alignItems: 'center',
    width: '100%',
  },
})

export { ProfileScreen }
