import notifee, { AndroidBadgeIconType, AndroidImportance } from '@notifee/react-native'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { nanoid } from 'nanoid/non-secure'
import {
  getNotificationsByGroupAndroid,
  updateAndroidBadgeCount,
} from 'src/utils/notifications/NotificationHelper'

const channelId = 'newPostAdminAndroid'
const groupId = 'new-post'

export async function newPostAdminNotification(
  notification: FirebaseMessagingTypes.RemoteMessage,
) {
  await notifee.createChannel({
    id: channelId,
    name: 'New post admin channel',
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
          title: 'Approve',
          pressAction: {
            id: 'approve',
          },
        },
        {
          title: 'Discard',
          pressAction: {
            id: 'discard',
          },
        },
      ],
      pressAction: {
        id: 'default',
      },
      groupId,
    },
    ios: {
      categoryId: 'new-post-admin',
    },
  })
  updateAndroidNewPostAdminNotificationGroup()
}

const groupNotificationId = 'count-of-new-posts'

export const updateAndroidNewPostAdminNotificationGroup = async () => {
  const notifications = await notifee.getDisplayedNotifications()

  const group = getNotificationsByGroupAndroid(notifications, groupId)
  const postsCount = group.length

  if (postsCount > 0) {
    await notifee.displayNotification({
      title: 'Check new posts',
      subtitle: `${postsCount} new post${postsCount > 1 ? 's' : ''}`,
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
