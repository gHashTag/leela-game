import notifee, { AndroidBadgeIconType, AndroidImportance } from '@notifee/react-native'
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { nanoid } from 'nanoid/non-secure'
import {
  getNotificationsByGroupAndroid,
  updateAndroidBadgeCount,
} from 'src/utils/notifications/NotificationHelper'

const channelId = 'invitationAndroid'
const groupId = 'invitation'

export async function invitationNotification({
  data,
}: FirebaseMessagingTypes.RemoteMessage) {
  await notifee.createChannel({
    id: channelId,
    name: 'Invitation channel',
    badge: false,
  })

  const { title, body } = data || {}

  updateAndroidBadgeCount({ type: 'increment' })
  notifee.incrementBadgeCount()

  await notifee.displayNotification({
    title,
    body,
    data,
    id: nanoid(10),
    android: {
      channelId,
      smallIcon: 'ic_notifee_cube',
      color: '#1EE4EC',
      largeIcon: require('../../../assets/icons/512.png'),
      badgeIconType: AndroidBadgeIconType.SMALL,
      importance: AndroidImportance.LOW,
      pressAction: {
        id: 'default',
      },
      groupId,
    },
    ios: {
      categoryId: 'game-invite',
    },
  })
  updateAndroidInvitationNotificationGroup()
}

const groupNotificationId = 'count-of-invitation'

export const updateAndroidInvitationNotificationGroup = async () => {
  const notifications = await notifee.getDisplayedNotifications()

  const group = getNotificationsByGroupAndroid(notifications, groupId)
  const invitationCount = group.length

  if (invitationCount > 0) {
    await notifee.displayNotification({
      title: 'Check new posts',
      subtitle: `${invitationCount} new post${invitationCount > 1 ? 's' : ''}`,
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
