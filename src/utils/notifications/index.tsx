import { Event } from '@notifee/react-native'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import {
  newPostAdminActionHandler,
  replyActionHandler,
} from 'src/utils/notifications/actionHandlers'
import { newPostAdminNotification } from 'src/utils/notifications/newPostAdminNotification'
import { replyNotification } from 'src/utils/notifications/replyNotification'

export async function displayNotification(
  notification: FirebaseMessagingTypes.RemoteMessage,
) {
  switch (notification.data?.notificationType) {
    case 'newComment':
      replyNotification(notification)
      break
    case 'newPostMessageForAdmin':
      newPostAdminNotification(notification)
      break
  }
}

export async function notificationActionsHandler(event: Event) {
  const notificationType = event.detail.notification?.data?.notificationType
  switch (notificationType) {
    case 'newComment':
      replyActionHandler(event)
      break
    case 'newPostMessageForAdmin':
      newPostAdminActionHandler(event)
      break
  }
}
