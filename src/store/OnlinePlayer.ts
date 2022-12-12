import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { makeAutoObservable } from 'mobx'
import * as Keychain from 'react-native-keychain'
import { captureException, navigate } from 'src/constants'
import { app } from 'src/context/app'
import i18next from 'src/i18n'
import {
  getIMG,
  getImagePicker,
  getUid,
  resetHistory,
  resetPlayer,
  updatePlan,
  uploadImg,
} from 'src/screens/helper'
import { DiceStore, actionsDice, delTokenOnSignOut } from 'src/store'
import { upStepOnline } from 'src/store/helper'
import { UserT } from 'src/types'

const initHistory = () => [
  {
    createDate: Date.now(),
    plan: 68,
    count: 0,
    status: 'start',
  },
]

const initState = () => ({
  // common
  email: '',
  firstName: '',
  lastName: '',
  lastStepTime: 0,
  owner: '',
  start: false,
  finish: false,
  timeText: ' ',
  canGo: false,
  plan: 68,
  // addons
  firstGame: false,
  loadingProf: true,
  history: initHistory(),
  isReported: true,
  avatar: '',
  // poster
  poster: {
    imgUrl: 'https://leelachakra.com/resource/LeelaChakra/poster.JPG',
    eventUrl: '',
    buttonColor: '#1c1c1c',
    loading: true,
  },
})

export const OnlinePlayer = makeAutoObservable<Istore>({
  store: initState(),
  async resetGame(): Promise<void> {
    try {
      OnlinePlayer.store = {
        ...OnlinePlayer.store,
        start: false,
        finish: false,
        plan: 68,
        history: initHistory(),
      }
      resetPlayer()
      resetHistory()
      updatePlan(68)
    } catch (err) {
      captureException(err)
    }
  },
  async SignOut(): Promise<void> {
    try {
      app.emit('change-online-state', false)
      delTokenOnSignOut()
      OnlinePlayer.store = initState()
      actionsDice.resetPlayer()
      Keychain.resetInternetCredentials('auth')
      await auth().signOut()
      navigate('WELCOME_SCREEN')
    } catch (err) {
      captureException(err)
    }
  },
  async SignOutToOffline(): Promise<void> {
    try {
      app.emit('change-online-state', false)
      OnlinePlayer.store = initState()
      actionsDice.resetPlayer()
      auth().signOut()
    } catch (err) {
      captureException(err)
    }
  },
  async loadProfile(prof) {
    try {
      OnlinePlayer.store.loadingProf = true
      OnlinePlayer.store = {
        ...OnlinePlayer.store,
        ...prof,
        canGo: Date.now() - prof.lastStepTime >= 86400000,
        history: prof.history.sort((a, b) => b.createDate - a.createDate).slice(0, 30),
      }
      if (prof.plan === 68 && !prof.finish) {
        actionsDice.setMessage(i18next.t('sixToBegin'))
      } else {
        actionsDice.setMessage(' ')
      }

      DiceStore.startGame = prof.start

      OnlinePlayer.store.avatar = await getIMG(prof.avatar)
      OnlinePlayer.store.loadingProf = false
    } catch (error) {
      captureException(error)
    }
  },
  async uploadImage(): Promise<void> {
    try {
      const image = await getImagePicker()
      if (image) {
        const fileName = await uploadImg(image)
        const prevImgUrl = auth().currentUser?.photoURL
        if (prevImgUrl) {
          await storage().ref(prevImgUrl).delete()
        }
        await auth().currentUser?.updateProfile({
          photoURL: fileName,
        })
        await firestore().collection('Profiles').doc(getUid()).update({
          avatar: fileName,
        })
        OnlinePlayer.store.avatar = await getIMG(fileName)
      }
    } catch (error) {
      captureException(error)
    }
  },
  async updateStep(): Promise<void> {
    upStepOnline()
  },
  async getPoster(): Promise<void> {
    try {
      OnlinePlayer.store.poster.loading = true
      const jsonResponse = await (
        await fetch('https://leelachakra.com/resource/LeelaChakra/poster.json')
      ).json()
      OnlinePlayer.store.poster = { ...OnlinePlayer.store.poster, ...jsonResponse }
    } catch (error) {
      captureException(error)
    } finally {
      OnlinePlayer.store.poster.loading = false
    }
  },
  getLeftTime(lastTime) {
    const day = 86400000
    const hour = 3600000
    const min = 60000
    const sec = 1000
    const dateNow = Date.now()
    const passTime = dateNow - lastTime
    const difference = day - passTime

    if (difference <= 0) {
      return '0'
    } else if (difference < min) {
      const secCount = Math.round(difference / sec)
      return `${secCount} ${i18next.t('timestamps-short.sec')}`
    } else if (difference < hour) {
      const minCount = Math.round(difference / min)
      return `${minCount} ${i18next.t('timestamps-short.min')}`
    } else {
      const hourCount = Math.round(difference / hour)
      return `${hourCount} ${i18next.t('timestamps-short.h')}`
    }
  },
})

interface Istore {
  store: OnlinePlayerStore
  resetGame: () => Promise<void>
  SignOut: () => Promise<void>
  loadProfile: (prof: UserT) => Promise<void>
  uploadImage: () => Promise<void>
  updateStep: () => Promise<void>
  getPoster: () => Promise<void>
  SignOutToOffline: () => Promise<void>
  getLeftTime: (lastTime: number) => string
}

interface OnlinePlayerStore extends UserT {
  timeText: string
  canGo: boolean
  loadingProf: boolean
  poster: {
    imgUrl: string
    eventUrl: string
    buttonColor: string
    loading: boolean
  }
}
