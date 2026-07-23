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

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <EmailShell preview={`You've been invited to join ${siteName}`}>
    <Heading style={h1Style}>You're invited</Heading>
    <Text style={textStyle}>
      You've been invited to join{' '}
      <Link href={siteUrl} style={inlineLink}>
        {siteName}
      </Link>
      . Accept the invite to create your account and get inside the console.
    </Text>
    <div style={buttonWrap}>
      <Button style={buttonStyle} href={confirmationUrl}>
        Accept invitation
      </Button>
    </div>
    <Text style={helperStyle}>
      Weren't expecting this? You can safely ignore this email.
    </Text>
  </EmailShell>
)

export default InviteEmail