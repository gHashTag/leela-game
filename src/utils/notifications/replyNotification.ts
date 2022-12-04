import notifee, { AndroidBadgeIconType, AndroidImportance } from '@notifee/react-native'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { nanoid } from 'nanoid/non-secure'

import {
  getNotificationsByGroupAndroid,
  updateAndroidBadgeCount,
} from './NotificationHelper'

const channelId = 'replyAndroid'
const groupId = 'new-comment'

export async function replyNotification(
  notification: FirebaseMessagingTypes.RemoteMessage,
) {
  await notifee.createChannel({
    id: channelId,
    name: 'Reply channel',
    badge: false,
  })

  const { title, body } = notification.data || {}

  updateAndroidBadgeCount({ type: 'increment' })
  notifee.incrementBadgeCount()

  await notifee.displayNotification({
    title,
    body,
    data: notification.data,
    id: nanoid(10),
    android: {
      channelId,
      smallIcon: 'ic_notifee_cube',
      color: '#1EE4EC',
      largeIcon: require('../../../assets/icons/512.png'),
      badgeIconType: AndroidBadgeIconType.SMALL,
      importance: AndroidImportance.LOW,
      actions: [
        {
          title: 'Reply',
          pressAction: {
            id: 'reply',
          },
          input: {
            placeholder: 'Your comment',
          },
        },
      ],
      pressAction: {
        id: 'default',
      },
      groupId,
    },
    ios: {
      categoryId: 'reply',
    },
  })
  updateAndroidCommentNotificationGroup()
}

const groupNotificationId = 'count-of-messages'

export const updateAndroidCommentNotificationGroup = async () => {
  const notifications = await notifee.getDisplayedNotifications()

  const group = getNotificationsByGroupAndroid(notifications, groupId)
  const messCount = group.length

  if (messCount > 0) {
    await notifee.displayNotification({
      title: 'Comments',
      subtitle: `${messCount} new comment${messCount > 1 ? 's' : ''}`,
      id: groupNotificationId,
      android: {
        channelId,
        groupSummary: true,
        color: '#1EE4EC',
        smallIcon: 'ic_notifee_cube',
        groupId,
      },
    })
  } else {
    await notifee.cancelNotification(groupNotificationId)
  }
}
