import React, { useContext, useEffect, useState } from 'react'

import firestore from '@react-native-firebase/firestore'
import { observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { s, vs } from 'react-native-size-matters'
import { PostCard, Space, Text } from 'src/components'
import { captureException } from 'src/constants'
import { getUid } from 'src/screens/helper'
import { TabContext } from 'src/screens/Tabs/ProfileScreen/TabContext'
import { PostStore } from 'src/store'

export const ReportsScene = observer(() => {
  const [limit, setLimit] = useState(15)
  const { t } = useTranslation()

  const { panGesture0, scrollViewGesture0, scrollOffset0, blockScrollUntilAtTheTop0 } =
    useContext(TabContext) as any

  useEffect(() => {
    const subPosts = firestore()
      .collection('Posts')
      .where('ownerId', '==', getUid())
      .orderBy('createTime', 'desc')
      .limit(limit)
      .onSnapshot(PostStore.fetchOwnPosts, captureException)
    return () => {
      subPosts()
    }
  }, [limit])

  const data = PostStore.store.ownPosts

  const newLimit = () => {
    if (data.length <= limit) {
      setLimit(pr => pr + 15)
    }
  }

  return (
    <GestureDetector
      gesture={Gesture.Simultaneous(
        Gesture.Race(blockScrollUntilAtTheTop0, panGesture0),
        scrollViewGesture0,
      )}
    >
      <Animated.ScrollView
        bounces={false}
        scrollEventThrottle={1}
        onScrollBeginDrag={e => {
          scrollOffset0.value = e.nativeEvent.contentOffset.y
        }}
      >
        <FlatList
          removeClippedSubviews={false}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          data={data}
          onEndReached={newLimit}
          onEndReachedThreshold={0.1}
          keyExtractor={a => a.id}
          renderItem={({ item }) => <PostCard postId={item.id} />}
          ItemSeparatorComponent={() => <Space height={vs(10)} />}
          ListHeaderComponent={<Space height={vs(10)} />}
          ListEmptyComponent={
            <View style={page.noPostBlock}>
              <Text textStyle={page.noPostText} h="h5" title={t('online-part.noPosts')} />
            </View>
          }
        />
      </Animated.ScrollView>
    </GestureDetector>
  )
})

const page = StyleSheet.create({
  noPostBlock: {
    paddingHorizontal: s(10),
  },
  noPostText: {
    textAlign: 'center',
  },
})
