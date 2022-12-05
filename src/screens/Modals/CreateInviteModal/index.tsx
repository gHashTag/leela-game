import React from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { RouteProp, useTheme } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { Pressable, StyleSheet } from 'react-native'
import { s, vs } from 'react-native-size-matters'
import { ButtonWithIcon, Input, KeyboardContainer, Space } from 'src/components'
import { black, lightGray } from 'src/constants'
import { RootStackParamList } from 'src/types'
import * as yup from 'yup'

interface CreateInviteModalT {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CREATE_INVITE_MODAL'>
  route: RouteProp<RootStackParamList, 'CREATE_INVITE_MODAL'>
}

const schema = yup
  .object()
  .shape({
    text: yup.string().trim().required(),
    title: yup.string().trim().required(),
  })
  .required()

export function CreateInviteModal({ navigation }: CreateInviteModalT) {
  const backgroundColor = useTheme().colors.background
  const { ...methods } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })
  const handleSubmit: SubmitHandler<FieldValues> = async ({ text, title }) => {
    console.log('🚀 - send with: ', { text, title })
    //sendInviteNotification({ text, title })

    methods.reset()
  }

  return (
    <KeyboardContainer>
      <Pressable onPress={() => navigation.goBack()} style={styles.transparentView}>
        <Pressable style={[styles.modal, { backgroundColor }]}>
          <FormProvider {...methods}>
            <Space height={vs(10)} />
            <Input name="title" placeholder="Notification title" color={black} />
            <Input name="text" placeholder="Notification body" color={black} />
            <Space height={vs(10)} />
            <ButtonWithIcon
              title="Send"
              onPress={methods.handleSubmit(handleSubmit, err => console.log(err))}
            />
          </FormProvider>
        </Pressable>
      </Pressable>
    </KeyboardContainer>
  )
}

const styles = StyleSheet.create({
  modal: {
    width: '95%',
    backgroundColor: 'red',
    borderRadius: s(15),
    borderWidth: s(2),
    borderColor: lightGray,
  },
  transparentView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'yellow',
    justifyContent: 'flex-end',
    paddingBottom: vs(25),
  },
})
