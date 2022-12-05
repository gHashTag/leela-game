import notifee, { Event, EventType } from '@notifee/react-native'
import { navRef } from 'src/constants'
import { MessagingStore } from 'src/store'
import { updateAndroidNewPostAdminNotificationGroup } from 'src/utils/notifications/newPostAdminNotification'
import { updateAndroidBadgeCount } from 'src/utils/notifications/NotificationHelper'

export const invitationActionHandler = async ({ type }: Event) => {
  switch (type) {
    case EventType.PRESS:
      if (navRef && navRef.isReady()) {
        navRef.navigate('MAIN', { screen: 'TAB_BOTTOM_4' })
      } else {
        const path = '/poster_screen'
        MessagingStore.path = path
      }
      break

    case EventType.DISMISSED:
      updateAndroidBadgeCount({ type: 'decrement' })
      await notifee.decrementBadgeCount()
  }
  updateAndroidNewPostAdminNotificationGroup()
}
