import React, { useMemo, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Button, Input, Loading, Space } from 'src/components'
import { dimGray, navigate } from 'src/constants'
import { startStepTimer } from 'src/screens/helper'
import { PostStore } from 'src/store'
import * as yup from 'yup'

interface CreatePostT {
  plan: number
}

export const CreatePost: React.FC<CreatePostT> = ({ plan }) => {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const schema = useMemo(
    () =>
      yup
        .object()
        .shape({
          text: yup
            .string()
            .trim()
            .min(100, t('validation:fewChars') || '')
            .required(t('validation:requireField') || ''),
        })
        .required(),
    [t],
  )

  const handleSubmit: SubmitHandler<FieldValues> = async data => {
    setLoading(true)
    methods.reset()
    startStepTimer()
    await PostStore.createPost({ text: data.text, plan: plan })
    navigate('TAB_BOTTOM_1')
    setLoading(false)
  }

  const { ...methods } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  return loading ? (
    <Loading />
  ) : (
    <FormProvider {...methods}>
      <Input
        name="text"
        color={dimGray}
        multiline
        placeholder={t('placeholderReport')}
        additionalStyle={page.input}
      />
      <Space height={20} />
      <Button
        title={t('actions.send')}
        onPress={methods.handleSubmit(handleSubmit, err => console.log(err))}
      />
    </FormProvider>
  )
}

const page = StyleSheet.create({
  input: {
    width: '100%',
    alignItems: 'center',
  },
})
