// @ts-ignore
import { ADMIN_SECRET_PASSWORD } from '@env'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'
import { captureException } from 'src/constants'
import { getUid } from 'src/screens/helper'

export const MessagingStore = makeAutoObservable({
  path: '',
})

makePersistable(MessagingStore, {
  name: 'MessagingStore',
  properties: ['path'],
})

const saveTokenToDatabase = async (token: string) => {
  const userUid = auth().currentUser?.uid
  try {
    if (userUid) {
      await firestore()
        .collection('Profiles')
        .doc(userUid)
        .update({
          tokens: firestore.FieldValue.arrayUnion(token),
        })
    }
  } catch (e) {
    captureException(e)
  }
}

const delTokenOnSignOut = async () => {
  const userUid = getUid()
  try {
    const token = await messaging().getToken()
    await firestore()
      .collection('Profiles')
      .doc(userUid)
      .update({
        tokens: firestore.FieldValue.arrayRemove(token),
      })
  } catch (error) {
    captureException(error)
  }
}

type sendInviteNotificationType = {
  text: string
  title: string
}

const sendInviteNotification = async ({ text, title }: sendInviteNotificationType) => {
  const url = `https://leelachakra.com/sendInvite/?passwordForAccess=${ADMIN_SECRET_PASSWORD}&title=${title}&text=${text}`
  try {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        passwordForAccess: ADMIN_SECRET_PASSWORD,
        title,
        text,
      }),
    })
  } catch (error) {
    captureException(error)
  }
}

export { saveTokenToDatabase, delTokenOnSignOut, sendInviteNotification }
