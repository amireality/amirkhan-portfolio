import React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  email?: string
  message?: string
  submittedAt?: string
}

const Email = ({ name = 'Unknown', email = 'unknown@unknown.com', message = '', submittedAt = new Date().toISOString() }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New contact form submission from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>[NEW SIGNAL] amir.setupr.com</Text>
        <Heading style={h1}>New contact submission</Heading>
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
        <Text style={footer}>Reply directly to this email to respond to {name}.</Text>
      </Container>
    </Body>
  </Html>
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

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', color: '#080808' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const eyebrow = { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#a16207', margin: '0 0 12px' }
const h1 = { fontSize: '28px', fontWeight: 700, margin: '0 0 24px', letterSpacing: '-0.02em', color: '#080808' }
const card = { border: '1px solid #e5e5e5', borderRadius: '8px', padding: '20px 24px' }
const label = { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#737373', margin: '0 0 6px' }
const value = { fontSize: '15px', lineHeight: '22px', color: '#080808', margin: '0 0 16px' }
const hr = { borderColor: '#e5e5e5', margin: '4px 0 16px' }
const footer = { fontSize: '12px', color: '#737373', margin: '24px 0 0' }