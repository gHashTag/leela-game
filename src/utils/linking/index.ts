import { LinkingOptions, getStateFromPath } from '@react-navigation/native'
import { Linking } from 'react-native'
import Branch from 'react-native-branch'
import { captureException } from 'src/constants'
import { app } from 'src/context/app'
import { RootStackParamList } from 'src/types'

import { formatLink, subscribeDeepLinkUrl } from './linkHelpers'

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['https://leelagame.app.link', 'leelagame://'],

  // Custom function for getting the URL,
  // which is used to open the application.
  async getInitialURL() {
    await app.tryLoadUserByCredentials(await app.getSecretCredentials())
    const uri = await Linking.getInitialURL()

    const lastParams = await Branch.getLatestReferringParams(true)
    const normalUrl = formatLink(lastParams)
    if (normalUrl && uri) {
      return normalUrl
    }
  },
  getStateFromPath(path, config) {
    return getCustomNavState({ path, config })
  },

  // Custom function for subscribing to incoming links
  subscribe(listener) {
    const unsubscribe = Branch.subscribe(async ({ error, params, uri }) => {
      if (error) {
        captureException(error)
        return
      }
      if (uri) {
        const url = formatLink(params)
        subscribeDeepLinkUrl(listener, url)
        return
      }
    })

    return unsubscribe
  },
  config: {
    screens: {
      MAIN: {
        screens: {
          TAB_BOTTOM_4: 'poster_screen',
        },
      },
      DETAIL_POST_SCREEN: {
        path: 'reply_detail/:postId',
      },
      WELCOME_SCREEN: '*',
    },
  },
}

// Custom state
interface getCustomNavStateT {
  path: string
  config?: any
}

const getCustomNavState = ({ path, config }: getCustomNavStateT) => {
  if (path.includes('reply_detail')) {
    return getDetailPostState({ path })
  }
  return getStateFromPath(path, config)
}

const getDetailPostState = ({ path }: getCustomNavStateT) => {
  const splitedPath = path.split('/')
  const postId = splitedPath[splitedPath.length - 1]

  return {
    routes: [
      {
        name: 'MAIN',
        state: {
          routes: [
            {
              name: 'TAB_BOTTOM_1',
            },
          ],
        },
      },
      {
        name: 'DETAIL_POST_SCREEN',
        params: {
          postId,
        },
        path,
      },
    ],
  }
}

export * from './linkHelpers'
