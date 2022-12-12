import { ViewProps } from 'react-native'

export interface KeyboardContainerProps extends ViewProps {
  isNumeric?: boolean
}

export function KeyboardContainer(props: KeyboardContainerProps): JSX.Element
