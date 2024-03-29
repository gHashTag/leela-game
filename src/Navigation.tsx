import React, { useEffect } from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as Sentry from '@sentry/react'
import { observer } from 'mobx-react'
import { StatusBar, useColorScheme } from 'react-native'
import Orientation from 'react-native-orientation-locker'
import SystemNavigationBar from 'react-native-system-navigation-bar'
import { Fallback } from 'src/components'
import { black, lightGray, navRef, white } from 'src/constants'
import {
  useExitModal,
  useGameAndProfileIsOnline,
  useIsAdmin,
  useNetwork,
} from 'src/hooks'
import { lang } from 'src/i18n'
import {
  ActionsModal,
  ChangeIntention,
  CreateInviteModal,
  DetailPostScreen,
  ExitPopup,
  GameScreen,
  InputTextModal,
  NetworkModal,
  OfflineProfileScreen,
  OnlineGameScreen,
  PlanReportModal,
  PlansDetailScreen,
  PlansScreen,
  PlayraScreen,
  PostScreen,
  PosterScreen,
  ProfileScreen,
  RulesDetailScreen,
  RulesScreen,
  SelectPlayersScreen,
  UpdateVersionModal,
  UserProfileScreen,
  VideoPopup,
  WelcomeScreen,
} from 'src/screens'
import {
  EmailVerifySignUp,
  Forgot,
  ForgotPassSubmit,
  Hello,
  SignIn,
  SignUp,
  SignUpAvatar,
  SignUpUsername,
  UserEdit,
} from 'src/screens/Authenticator'
import { checkVersion, getFireBaseRef } from 'src/screens/helper'
import { DiceStore } from 'src/store'
import TabBar from 'src/TabBar'
import { RootStackParamList, RootTabParamList } from 'src/types'
import { linking } from 'src/utils'

const DarkTheme = {
  dark: true,
  colors: {
    primary: '#FF06F4',
    background: '#1c1c1c',
    card: '#ffffff',
    text: '#FFFFFF',
    border: '#c7c7cc',
    notification: '#ff453a',
  },
}

const LightTheme = {
  dark: false,
  colors: {
    primary: '#FF06F4',
    background: '#FFFFFF',
    card: '#ffffff',
    text: '#1c1c1c',
    border: '#c7c7cc',
    notification: '#ff453a',
  },
}

const TabNavigator = createMaterialTopTabNavigator<RootTabParamList>()

const Tab = observer(() => {
  useGameAndProfileIsOnline()
  useExitModal()
  useNetwork()
  const isAdmin = useIsAdmin()
  return (
    <TabNavigator.Navigator
      tabBar={props => <TabBar {...props} />}
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: false,
      }}
      initialRouteName="TAB_BOTTOM_0"
    >
      <TabNavigator.Screen name="TAB_BOTTOM_0" component={GameScreen} />
      {DiceStore.online && (
        <TabNavigator.Screen name="TAB_BOTTOM_1" component={PostScreen} />
      )}
      <TabNavigator.Screen
        name="TAB_BOTTOM_2"
        component={DiceStore.online ? ProfileScreen : OfflineProfileScreen}
      />
      <TabNavigator.Screen name="TAB_BOTTOM_3" component={OnlineGameScreen} />
      {(lang === 'ru' || isAdmin) && (
        <TabNavigator.Screen name="TAB_BOTTOM_4" component={PosterScreen} />
      )}
    </TabNavigator.Navigator>
  )
})

const Stack = createNativeStackNavigator<RootStackParamList>()

const App = () => {
  // Themes
  const isDark = useColorScheme() === 'dark'
  const theme = isDark ? DarkTheme : LightTheme
  const color = isDark ? 'light-content' : 'dark-content'

  useEffect(() => {
    SystemNavigationBar.setNavigationColor(
      isDark ? black : white,
      isDark ? 'dark' : 'light',
    )
    SystemNavigationBar.setNavigationBarDividerColor(lightGray)
    Orientation.lockToPortrait()
    // check version
  }, [isDark])

  useEffect(() => {
    const unsub = getFireBaseRef('/minVersion/').on('value', async snap => {
      checkVersion(snap.val())
    })
    return () => getFireBaseRef('/minVersion/').off('value', unsub)
  }, [])

  return (
    <NavigationContainer
      fallback={<Fallback />}
      // @ts-ignore
      linking={linking}
      ref={navRef}
      theme={theme}
    >
      <StatusBar backgroundColor={isDark ? black : white} barStyle={color} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
        initialRouteName="WELCOME_SCREEN"
      >
        {/* Auth */}
        <Stack.Group
          screenOptions={{
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="SIGN_IN" component={SignIn} />
          <Stack.Screen name="FORGOT" component={Forgot} />
          <Stack.Screen name="FORGOT_PASSWORD_SUBMIT" component={ForgotPassSubmit} />
          <Stack.Screen name="SIGN_UP" component={SignUp} />
          <Stack.Screen name="SIGN_UP_USERNAME" component={SignUpUsername} />
          <Stack.Screen name="SIGN_UP_AVATAR" component={SignUpAvatar} />
          <Stack.Screen name="EMAIL_VERIFY_SIGN_UP" component={EmailVerifySignUp} />
        </Stack.Group>

        <Stack.Screen name="WELCOME_SCREEN" component={WelcomeScreen} />
        <Stack.Screen name="HELLO" component={Hello} />
        <Stack.Screen name="SELECT_PLAYERS_SCREEN" component={SelectPlayersScreen} />

        <Stack.Screen name="MAIN" component={Tab} />
        {/* Rules */}
        <Stack.Group
          screenOptions={{
            animation: 'slide_from_left',
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="RULES_SCREEN" component={RulesScreen} />
          <Stack.Screen name="RULES_DETAIL_SCREEN" component={RulesDetailScreen} />
        </Stack.Group>

        {/* Plans */}
        <Stack.Group
          screenOptions={{
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="USER_PROFILE_SCREEN" component={UserProfileScreen} />
          <Stack.Screen name="PLANS_SCREEN" component={PlansScreen} />
          <Stack.Screen
            name="PLANS_DETAIL_SCREEN"
            component={PlansDetailScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />
        </Stack.Group>

        <Stack.Screen name="PLAYRA_SCREEN" component={PlayraScreen} />
        <Stack.Screen name="USER_EDIT" component={UserEdit} />
        <Stack.Screen name="CHANGE_INTENTION_SCREEN" component={ChangeIntention} />
        {/* Post */}
        <Stack.Screen
          options={{
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
          name="DETAIL_POST_SCREEN"
          component={DetailPostScreen}
        />
        {/* Modals */}
        <Stack.Screen name="VIDEO_SCREEN" component={VideoPopup} />
        <Stack.Group
          screenOptions={{
            presentation: 'transparentModal',
            animation: 'fade',
            gestureEnabled: false,
          }}
        >
          <Stack.Screen name="CREATE_INVITE_MODAL" component={CreateInviteModal} />
          <Stack.Screen name="UPDATE_VERSION_MODAL" component={UpdateVersionModal} />
          <Stack.Screen
            name="REPLY_MODAL"
            options={{
              animation: 'slide_from_bottom',
            }}
            component={ActionsModal}
          />
          <Stack.Screen name="INPUT_TEXT_MODAL" component={InputTextModal} />
          <Stack.Screen name="EXIT_MODAL" component={ExitPopup} />
          <Stack.Screen name="NETWORK_MODAL" component={NetworkModal} />
          <Stack.Screen name="PLAN_REPORT_MODAL" component={PlanReportModal} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Sentry.withProfiler(App)
