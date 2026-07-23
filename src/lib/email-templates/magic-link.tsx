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

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <EmailShell preview={`Your one-time login link for ${siteName}`}>
    <Heading style={h1Style}>Your login link</Heading>
    <Text style={textStyle}>
      Tap the button below to sign in to {siteName}. The link expires shortly,
      so use it soon.
    </Text>
    <div style={buttonWrap}>
      <Button style={buttonStyle} href={confirmationUrl}>
        Sign me in
      </Button>
    </div>
    <Text style={helperStyle}>
      Didn't request this login link? You can safely ignore this email.
    </Text>
  </EmailShell>
)

export default MagicLinkEmail