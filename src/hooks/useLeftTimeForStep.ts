import { useEffect } from 'react'

import { OnlinePlayer } from 'src/store'

export const useLeftTimeForStep = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = Date.now()
      OnlinePlayer.store.timeText = OnlinePlayer.getLeftTime(
        OnlinePlayer.store.lastStepTime,
      )
      if (
        currentDate - OnlinePlayer.store.lastStepTime >= 86400000 &&
        OnlinePlayer.store.lastStepTime !== 0
      ) {
        OnlinePlayer.store.canGo = true
      } else {
        OnlinePlayer.store.canGo = false
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])
}
