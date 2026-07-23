import React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  message?: string
}

const Email = ({ name = 'there', message = '' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Signal received. I'll be in touch inside 24 hours.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>[SIGNAL RECEIVED] amir.setupr.com</Text>
        <Heading style={h1}>Thanks, {name}.</Heading>
        <Text style={body}>
          Your message reached the console. I read every inbound personally and reply
          inside 24 hours, usually faster.
        </Text>
        <Text style={body}>
          In the meantime, if it's urgent you can reply directly to this email.
        </Text>
        {message ? (
          <Section style={card}>
            <Text style={label}>What you sent</Text>
            <Text style={{ ...value, whiteSpace: 'pre-wrap' }}>{message}</Text>
          </Section>
        ) : null}
        <Hr style={hr} />
        <Text style={sig}>
          Amir Khan<br />
          Founder, Setupr<br />
          <a href="https://amir.setupr.com" style={link}>amir.setupr.com</a>
        </Text>
      </Container>
    </Body>
  </Html>
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

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', color: '#080808' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const eyebrow = { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#a16207', margin: '0 0 12px' }
const h1 = { fontSize: '32px', fontWeight: 700, margin: '0 0 20px', letterSpacing: '-0.02em', color: '#080808' }
const body = { fontSize: '15px', lineHeight: '24px', color: '#404040', margin: '0 0 16px' }
const card = { border: '1px solid #e5e5e5', borderRadius: '8px', padding: '16px 20px', margin: '20px 0' }
const label = { fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#737373', margin: '0 0 6px' }
const value = { fontSize: '14px', lineHeight: '22px', color: '#080808', margin: 0 }
const hr = { borderColor: '#e5e5e5', margin: '28px 0 20px' }
const sig = { fontSize: '14px', color: '#404040', lineHeight: '22px' }
const link = { color: '#a16207', textDecoration: 'none' }