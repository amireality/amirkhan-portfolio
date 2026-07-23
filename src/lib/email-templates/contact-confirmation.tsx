import React from 'react'
import { Heading, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import {
  EmailShell,
  border,
  fgHigh,
  fgLow,
  h1Style,
  helperStyle,
  surface,
  textStyle,
} from './_layout'

interface Props {
  name?: string
  message?: string
}

const Email = ({ name = 'there', message = '' }: Props) => (
  <EmailShell preview="Signal received. I'll be in touch inside 24 hours.">
    <Heading style={h1Style}>Thanks, {name}.</Heading>
    <Text style={textStyle}>
      Your message reached the console. I read every inbound personally and
      reply inside 24 hours, usually faster.
    </Text>
    <Text style={textStyle}>
      If it's urgent, just reply directly to this email and it lands in my
      inbox.
    </Text>
    {message ? (
      <Section style={card}>
        <Text style={label}>What you sent</Text>
        <Text style={{ ...value, whiteSpace: 'pre-wrap' }}>{message}</Text>
      </Section>
    ) : null}
    <Text style={helperStyle}>
      You're receiving this because you submitted the contact form on
      amir.setupr.com.
    </Text>
  </EmailShell>
)

export const template = {
  component: Email,
  subject: "Signal received, I'll be in touch",
  displayName: 'Contact form → Visitor confirmation',
  previewData: {
    name: 'Jane',
    message: 'Interested in a full site build and brand system for a new venture.',
  },
} satisfies TemplateEntry

const card = {
  border: `1px solid ${border}`,
  borderRadius: '4px',
  padding: '18px 22px',
  margin: '20px 0 24px',
  backgroundColor: surface,
}
const label = {
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
  fontSize: '10px',
  letterSpacing: '3px',
  textTransform: 'uppercase' as const,
  color: fgLow,
  margin: '0 0 8px',
}
const value = {
  fontSize: '14px',
  lineHeight: '22px',
  color: fgHigh,
  margin: 0,
}