import { DiceStore, OnlinePlayer } from 'src/store'

export function useIsAdmin() {
  const isAdmin = DiceStore.online && OnlinePlayer.store.status === 'Admin'
  return isAdmin
}
