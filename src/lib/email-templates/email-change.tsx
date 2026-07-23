import * as React from 'react'
import { Button, Heading, Link, Text } from '@react-email/components'
import {
  EmailShell,
  buttonStyle,
  buttonWrap,
  h1Style,
  helperStyle,
  inlineLink,
  textStyle,
} from './_layout'

interface EmailChangeEmailProps {
  siteName: string
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <EmailShell preview={`Confirm your email change for ${siteName}`}>
    <Heading style={h1Style}>Confirm email change</Heading>
    <Text style={textStyle}>
      You asked to change the email on your {siteName} account from{' '}
      <Link href={`mailto:${oldEmail}`} style={inlineLink}>
        {oldEmail}
      </Link>{' '}
      to{' '}
      <Link href={`mailto:${newEmail}`} style={inlineLink}>
        {newEmail}
      </Link>
      .
    </Text>
    <div style={buttonWrap}>
      <Button style={buttonStyle} href={confirmationUrl}>
        Confirm email change
      </Button>
    </div>
    <Text style={helperStyle}>
      Didn't request this? Secure your account immediately by resetting your
      password.
    </Text>
  </EmailShell>
)

export default EmailChangeEmail