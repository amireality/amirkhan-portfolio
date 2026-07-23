import * as React from 'react'
import { Button, Heading, Text } from '@react-email/components'
import {
  EmailShell,
  buttonStyle,
  buttonWrap,
  h1Style,
  helperStyle,
  textStyle,
} from './_layout'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <EmailShell preview={`Reset your password for ${siteName}`}>
    <Heading style={h1Style}>Reset your password</Heading>
    <Text style={textStyle}>
      We received a request to reset your password for {siteName}. Choose a
      new password using the button below.
    </Text>
    <div style={buttonWrap}>
      <Button style={buttonStyle} href={confirmationUrl}>
        Set a new password
      </Button>
    </div>
    <Text style={helperStyle}>
      Didn't ask for a reset? Ignore this email, your password stays as-is.
    </Text>
  </EmailShell>
)

export default RecoveryEmail