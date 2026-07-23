import * as React from 'react'
import { Heading, Text } from '@react-email/components'
import {
  EmailShell,
  codeBoxStyle,
  h1Style,
  helperStyle,
  textStyle,
} from './_layout'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({
  token,
}: ReauthenticationEmailProps) => (
  <EmailShell preview="Your verification code for the console">
    <Heading style={h1Style}>Confirm reauthentication</Heading>
    <Text style={textStyle}>
      Enter the code below to confirm it's really you.
    </Text>
    <div style={codeBoxStyle}>{token}</div>
    <Text style={helperStyle}>
      This code expires shortly. If you didn't request it, ignore this email.
    </Text>
  </EmailShell>
)

export default ReauthenticationEmail