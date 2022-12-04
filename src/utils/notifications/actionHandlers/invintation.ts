import notifee, { Event, EventType } from '@notifee/react-native'
import { navRef } from 'src/constants'
import { getUid } from 'src/screens/helper'
import { MessagingStore, PostStore } from 'src/store'
import { updateAndroidNewPostAdminNotificationGroup } from 'src/utils/notifications/newPostAdminNotification'
import {
  cancel,
  updateAndroidBadgeCount,
} from 'src/utils/notifications/NotificationHelper'

export const newPostAdminActionHandler = async ({ type, detail }: Event) => {
  const { pressAction, notification } = detail

  const { postId }: any = notification?.data || {}

  switch (type) {
    case EventType.ACTION_PRESS:
      switch (pressAction?.id) {
        case 'approve':
          if (postId) {
            await cancel({ notification, isInput: true })
            PostStore.acceptPost(false, postId)
          }
          break
        case 'discard':
          await cancel({ notification, isInput: true })
      }
      break

    case EventType.PRESS:
      const reportId = postId || ''
      await notifee.decrementBadgeCount()
      updateAndroidBadgeCount({ type: 'decrement' })

      if (navRef && navRef.isReady()) {
        if (getUid()) {
          navRef.navigate('DETAIL_POST_SCREEN', { postId: reportId })
        }
      } else {
        const path = `/reply_detail/${reportId}`
        MessagingStore.path = path
      }
      break

    case EventType.DISMISSED:
      updateAndroidBadgeCount({ type: 'decrement' })
      await notifee.decrementBadgeCount()
  }
  updateAndroidNewPostAdminNotificationGroup()
}
