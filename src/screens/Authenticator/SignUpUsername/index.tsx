import React, { ReactElement, useState } from 'react'
import { useMemo } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import auth from '@react-native-firebase/auth'
import { RouteProp, useTheme } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {
  FieldValues,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet } from 'react-native'
import { s, vs } from 'react-native-size-matters'
import {
  AppContainer,
  Button,
  Input,
  KeyboardContainer,
  Loading,
  Space,
} from 'src/components'
import { H, W, black, goBack, white } from 'src/constants'
import { useNoBackHandler } from 'src/hooks'
import { createProfile, getUid } from 'src/screens/helper'
import { actionsDice } from 'src/store'
import { RootStackParamList } from 'src/types'
import * as yup from 'yup'

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SIGN_UP_USERNAME'
>
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'SIGN_UP_USERNAME'>

type SignUpUsernameT = {
  navigation: ProfileScreenNavigationProp
  route: ProfileScreenRouteProp
}

export const SignUpUsername = ({ route, navigation }: SignUpUsernameT): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false)
  const { t } = useTranslation()

  const schema = useMemo(
    () =>
      yup
        .object()
        .shape({
          firstName: yup
            .string()
            .trim()
            .min(2, t('validation:twoSymbolRequire') || '')
            .required()
            .max(15, `${t('validation:manyCharacters')}15`),
          lastName: yup
            .string()
            .trim()
            .min(2, t('validation:twoSymbolRequire') || '')
            .required()
            .max(20, `${t('validation:manyCharacters')}20`),
        })
        .required(),
    [t],
  )

  const { ...methods } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })
  useNoBackHandler()

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setLoading(true)
    const { firstName, lastName } = data
    const { email } = route.params
    await auth().currentUser?.updateProfile({
      displayName: `${firstName} ${lastName}`,
    })
    await createProfile({
      email,
      // @ts-ignore
      uid: getUid(),
      firstName,
      lastName,
    })
    navigation.navigate('SIGN_UP_AVATAR')
    actionsDice.setOnline(true)
    actionsDice.setPlayers(1)
    setLoading(false)
  }
  const onError: SubmitErrorHandler<FieldValues> = errors => {
    return console.log(errors)
  }

  const { dark } = useTheme()
  const color = dark ? white : black

  return (
    <AppContainer
      enableBackgroundBottomInsets
      enableBackgroundTopInsets
      onPress={goBack}
      title=" "
      iconLeft={null}
    >
      {loading ? (
        <Loading />
      ) : (
        <KeyboardContainer>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <Space height={H / 5} />
            <FormProvider {...methods}>
              <Input
                name="firstName"
                placeholder={t('auth.firstName')}
                autoCapitalize="none"
                color={color}
                additionalStyle={{ width: W - s(40) }}
              />
              <Input
                name="lastName"
                placeholder={t('auth.lastName')}
                autoCapitalize="none"
                color={color}
                additionalStyle={{ width: W - s(40) }}
              />
              <Space height={vs(30)} />
              <Button
                title={t('auth.signUp')}
                onPress={methods.handleSubmit(onSubmit, onError)}
              />
              <Space height={vs(10)} />
            </FormProvider>
          </ScrollView>
        </KeyboardContainer>
      )}
    </AppContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
})
