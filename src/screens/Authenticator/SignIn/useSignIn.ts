import { useCallback, useMemo, useRef, useState } from 'react'

// @ts-expect-error
import { EMAIL, PASSWORD } from '@env'
import { yupResolver } from '@hookform/resolvers/yup'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { captureException } from 'src/constants'
import { app } from 'src/context/app'
import * as yup from 'yup'

const initialValues = { email: __DEV__ ? EMAIL : '', password: __DEV__ ? PASSWORD : '' }

export const useSignIn = () => {
  const userInfo = useRef('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>('')
  const { t } = useTranslation()

  const schema = useMemo(
    () =>
      yup
        .object()
        .shape({
          email: yup
            .string()
            .email(t('validation:invalidEmail') || '')
            .trim()
            .required(t('validation:requireField') || ''),
          password: yup
            .string()
            .required(t('validation:requireField') || '')
            .min(6, t('validation:shortPassword') || ''),
        })
        .required(),
    [t],
  )

  const { ...methods } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  })

  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      userInfo.current = data.email
      setLoading(true)
      setError('')
      const { email, password } = data

      try {
        await app.tryLoadUserByCredentials({ username: email, password })
        await app.updateSignCredentials(email, password)
      } catch (err: any) {
        switch (err?.code) {
          case 'auth/invalid-email':
            setError(t('validation:invalidEmail'))
            break
          case 'auth/user-not-found':
            setError(t('validation:userNotFound'))
            break
          case 'auth/wrong-password':
            setError(t('auth.forgotPassword'))
            break
          case 'auth/network-request-failed':
            setError(t('validation:networkRequestFailed'))
            break
          case 'auth/too-many-requests':
            setError(t('validation:manyRequests'))
            break
          default:
            captureException(err?.message)
            setError(err?.code)
            break
        }
      }
      setLoading(false)
    },
    [t],
  )

  return { onSubmit, methods, error: error || '', loading, userInfo }
}
