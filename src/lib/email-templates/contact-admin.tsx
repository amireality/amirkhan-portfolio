import React from 'react'
import { Heading, Hr, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'
import {
  EmailShell,
  border,
  fgHigh,
  fgLow,
  h1Style,
  helperStyle,
  surface,
} from './_layout'

interface Props {
  name?: string
  email?: string
  message?: string
  submittedAt?: string
}

const Email = ({ name = 'Unknown', email = 'unknown@unknown.com', message = '', submittedAt = new Date().toISOString() }: Props) => (
  <EmailShell preview={`New signal from ${name} on amir.setupr.com`}>
    <Heading style={h1Style}>New contact submission</Heading>
    <Section style={card}>
      <Text style={label}>From</Text>
      <Text style={value}>{name} &lt;{email}&gt;</Text>
      <Hr style={hr} />
      <Text style={label}>Message</Text>
      <Text style={{ ...value, whiteSpace: 'pre-wrap' }}>{message}</Text>
      <Hr style={hr} />
      <Text style={label}>Received</Text>
      <Text style={value}>{submittedAt}</Text>
    </Section>
    <Text style={helperStyle}>Reply to this email to respond directly to {name}.</Text>
  </EmailShell>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) => `New signal from ${data.name || 'the site'}`,
  displayName: 'Contact form → Amir',
  to: 'amir@setupr.com',
  previewData: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Interested in a full site build and brand system for a new venture.',
    submittedAt: new Date().toISOString(),
  },
} satisfies TemplateEntry

const card = {
  border: `1px solid ${border}`,
  borderRadius: '4px',
  padding: '20px 24px',
  backgroundColor: surface,
}
const label = {
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
  fontSize: '10px',
  letterSpacing: '3px',
  textTransform: 'uppercase' as const,
  color: fgLow,
  margin: '0 0 6px',
}
const value = {
  fontSize: '15px',
  lineHeight: '22px',
  color: fgHigh,
  margin: '0 0 16px',
}
const hr = { borderColor: border, margin: '4px 0 16px' }