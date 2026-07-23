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

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <EmailShell preview={`Confirm your email to activate access on ${siteName}`}>
    <Heading style={h1Style}>Confirm your email</Heading>
    <Text style={textStyle}>
      Welcome to{' '}
      <Link href={siteUrl} style={inlineLink}>
        {siteName}
      </Link>
      . Verify {recipient} to activate your access to the console.
    </Text>
    <div style={buttonWrap}>
      <Button style={buttonStyle} href={confirmationUrl}>
        Verify my email
      </Button>
    </div>
    <Text style={helperStyle}>
      If you didn't request this, ignore this email. No account will be created.
    </Text>
  </EmailShell>
)

export default SignupEmail