import React, { useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { RouteProp, useTheme } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'
import { s, vs } from 'react-native-size-matters'
import { Input, KeyboardContainer, Text } from 'src/components'
import { W, gray } from 'src/constants'
import { RootStackParamList } from 'src/types'
import * as yup from 'yup'

interface InputTextT {
  navigation: NativeStackNavigationProp<RootStackParamList, 'INPUT_TEXT_MODAL'>
  route: RouteProp<RootStackParamList, 'INPUT_TEXT_MODAL'>
}
const max = 250
const schema = yup
  .object()
  .shape({
    text: yup.string().trim().min(2).max(max).required(),
  })
  .required()

export function InputTextModal({ navigation, route }: InputTextT) {
  const { onError, onSubmit } = route.params
  const { t } = useTranslation()

  const { ...methods } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })
  const [length, setLength] = useState(0)

  useEffect(() => {
    setTimeout(() => methods.setFocus('text'), 100)
  }, [])
  const {
    colors: { background },
  } = useTheme()

  const handleSubmit: SubmitHandler<FieldValues> = async data => {
    onSubmit && onSubmit(data.text)
    navigation.goBack()
    methods.reset()
  }
  return (
    <View style={styles.transparentView}>
      <KeyboardContainer>
        <Pressable onPress={() => navigation.goBack()} style={styles.goBackView} />
        <View style={[styles.inputContainer, { backgroundColor: background }]}>
          <FormProvider {...methods}>
            <Input
              onChange={e => setLength(e.nativeEvent.text.length)}
              name="text"
              placeholder={t('online-part.uComment')}
              color={gray}
              additionalStyle={styles.input}
              showError={false}
              onSubmitEditing={methods.handleSubmit(
                handleSubmit,
                err => onError && onError(err),
              )}
            />
            <Text h="h9" title={`(${length}/${max})`} />
          </FormProvider>
        </View>
      </KeyboardContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  transparentView: {
    flex: 1,
  },
  input: {
    width: W - s(75),
    marginBottom: vs(10),
    marginLeft: s(10),
  },
  inputContainer: {
    paddingHorizontal: vs(5),
    paddingTop: vs(10),
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: s(8),
    borderTopRightRadius: s(8),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: s(1),
    borderBottomWidth: 0,
    borderColor: gray,
  },
  goBackView: {
    flex: 1,
  },
})
