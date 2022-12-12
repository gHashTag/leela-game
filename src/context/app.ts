import { createContext } from 'react'

import { EventEmitter } from 'events'

import auth from '@react-native-firebase/auth'
import { FirebaseDatabaseTypes } from '@react-native-firebase/database'
import messaging from '@react-native-firebase/messaging'
import { AppState } from 'react-native'
import { getInternetCredentials, setInternetCredentials } from 'react-native-keychain'
import { OpenPlanReportModal, accountHasBanAlert, navigate } from 'src/constants'
import { captureException } from 'src/constants'
import i18next from 'src/i18n'
import { getFireBaseRef, getProfile } from 'src/screens/helper'
import { MessagingStore, OnlinePlayer, actionsDice, saveTokenToDatabase } from 'src/store'
import { UserT } from 'src/types'

enum AppStatus {
  inactive,
  active,
}

function getAppStatus() {
  return AppState.currentState === 'active' ? AppStatus.active : AppStatus.inactive
}

class App extends EventEmitter {
  authenticated: boolean = false
  private online_state_reference?: FirebaseDatabaseTypes.Reference
  private appStatus: AppStatus = AppStatus.inactive

  constructor() {
    super()

    this.appStatus = getAppStatus()
    AppState.addEventListener('change', this.onAppStatusChanged.bind(this))

    this.on('change-online-state', payload => {
      this.online_state_reference?.set(payload)
    })
  }

  updateSignCredentials(email: string, password: string) {
    return setInternetCredentials('auth', email, password)
  }

  async getSecretCredentials() {
    const { password, username } = (await getInternetCredentials('auth')) || {}
    if (password && username) {
      return Promise.resolve({ password, username })
    } else {
      return Promise.reject('credentials_not_found')
    }
  }

  async tryLoadUserByCredentials(
    { username, password }: { username: string; password: string },
    isAutoSign?: boolean,
  ) {
    try {
      if (!username || !password) {
        return Promise.reject('credentials_not_found')
      }

      const {
        user: { emailVerified },
      } = await auth().signInWithEmailAndPassword(username, password)

      actionsDice.setOnline(true)

      if (emailVerified) {
        this.authenticated = true
        const profile = await getProfile()

        if (profile?.status === 'ban') {
          !isAutoSign && accountHasBanAlert()
          return Promise.reject('banned')
        }

        if (!profile?.firstGame && !profile?.lastName) {
          navigate('SIGN_UP_USERNAME', { email: username })
        } else if (!profile.avatar) {
          navigate('SIGN_UP_AVATAR')
        } else if (!profile.intention) {
          navigate('CHANGE_INTENTION_SCREEN', {
            blockGoBack: true,
            title: i18next.t('online-part.createIntention'),
          })
        } else {
          navigate('MAIN', { screen: 'TAB_BOTTOM_0' })
          this.loadUser(profile)
          if (!profile.isReported && profile.plan) {
            OpenPlanReportModal(profile.plan)
          } else {
            this.openLink()
          }

          this.online_state_reference = getFireBaseRef(`/online/${profile.owner}`)
          this.emit('change-online-state', true)
          this.online_state_reference.onDisconnect().set(false)
        }
      } else {
        navigate('EMAIL_VERIFY_SIGN_UP', {
          email: username,
        })
      }
      return Promise.resolve()
    } catch (error) {
      captureException(error)
      return Promise.reject(error)
    }
  }

  loadProfile(prof: UserT) {
    OnlinePlayer.loadProfile(prof)
  }

  /**
   * @returns is enabled notifications
   */
  async requestNotificationsPermissions() {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      messaging()
        .getToken()
        .then(token => {
          return saveTokenToDatabase(token)
        })

      messaging().onTokenRefresh(token => {
        saveTokenToDatabase(token)
      })
    }

    return Promise.resolve(enabled)
  }

  loadUser(prof: UserT) {
    OnlinePlayer.loadProfile(prof)
  }

  openLink(link?: string) {
    setTimeout(() => {
      if (MessagingStore.path || link) {
        this.emit('new-link-action', link ?? MessagingStore.path)
      }
      MessagingStore.path = ''
    }, 0)
  }

  async onAppStatusChanged() {
    const appStatus = getAppStatus()
    if (this.appStatus !== appStatus) {
      switch (appStatus) {
        case AppStatus.active:
          break
        case AppStatus.inactive:
          break
      }

      this.appStatus = appStatus
    }
  }
}

export const app = new App()

export const AppContext = createContext(app)
