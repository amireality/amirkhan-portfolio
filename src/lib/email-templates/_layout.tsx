import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

// Full-bleed dark editorial layout. The whole email background is #080808,
// matching amir.setupr.com. No inner card, no white margins.

interface EmailShellProps {
  preview: string
  children: React.ReactNode
}

export const EmailShell = ({ preview, children }: EmailShellProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Section style={fullBleed}>
        <Container style={container}>
          <Text style={eyebrow}>[AMIR.SETUPR.COM] // Console</Text>
          {children}
          <Hr style={hr} />
          <SignatureFooter />
        </Container>
      </Section>
    </Body>
  </Html>
)

export const SignatureFooter = () => (
  <>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          <td style={{ verticalAlign: 'top', paddingRight: '16px' }}>
            <Text style={sigName}>
              Amir Khan <span style={{ color: accent }}>//</span>
            </Text>
            <Text style={sigLine}>
              Founder of Setupr. Building brands, websites, and AI-native
              systems.
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '18px' }}>
      <tbody>
        <tr>
          <td style={sigLinksCell}>
            <Link href="https://www.linkedin.com/in/amireality/" style={sigLink}>LinkedIn</Link>
            <span style={sigDivider}>·</span>
            <Link href="https://www.instagram.com/amireality/" style={sigLink}>Instagram</Link>
            <span style={sigDivider}>·</span>
            <Link href="https://x.com/Amireality" style={sigLink}>X</Link>
            <span style={sigDivider}>·</span>
            <Link href="https://setupr.com/" style={sigLink}>Setupr</Link>
            <span style={sigDivider}>·</span>
            <Link href="https://amir.setupr.com/" style={sigLink}>Portfolio</Link>
          </td>
        </tr>
      </tbody>
    </table>
    <Text style={sigMeta}>
      © {new Date().getFullYear()} Amir Khan. All systems nominal.
    </Text>
    <Text style={sigMetaFaint}>Designed for the late-night console.</Text>
  </>
)

// ---- Shared design tokens ----

export const accent = '#fbbf24'
export const bg = '#080808'
export const surface = '#0f0f0f'
export const border = '#1f1f1f'
export const fgHigh = '#f5f5f5'
export const fgMid = '#a3a3a3'
export const fgLow = '#737373'

const fontStack =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
const monoStack =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"

const main = {
  backgroundColor: bg,
  margin: 0,
  padding: 0,
  fontFamily: fontStack,
  color: fgHigh,
}
const fullBleed = {
  backgroundColor: bg,
  padding: '40px 16px',
}
const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 28px',
  backgroundColor: bg,
}
const eyebrow = {
  fontFamily: monoStack,
  fontSize: '10px',
  letterSpacing: '3px',
  textTransform: 'uppercase' as const,
  color: accent,
  margin: '0 0 28px',
}
const hr = {
  borderColor: border,
  borderStyle: 'solid',
  borderWidth: '1px 0 0 0',
  margin: '36px 0 24px',
}
const sigName = {
  fontFamily: fontStack,
  fontSize: '22px',
  fontWeight: 700,
  color: fgHigh,
  margin: '0 0 6px',
  letterSpacing: '-0.01em',
  textTransform: 'uppercase' as const,
}
const sigLine = {
  fontSize: '13px',
  lineHeight: '20px',
  color: fgMid,
  margin: 0,
}
const sigLinksCell = {
  fontFamily: monoStack,
  fontSize: '11px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  color: fgLow,
}
const sigLink = {
  color: fgHigh,
  textDecoration: 'none',
  fontFamily: monoStack,
  fontSize: '11px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
}
const sigDivider = { color: fgLow, padding: '0 8px' }
const sigMeta = {
  fontFamily: monoStack,
  fontSize: '10px',
  letterSpacing: '0.25em',
  textTransform: 'uppercase' as const,
  color: fgLow,
  margin: '20px 0 4px',
}
const sigMetaFaint = {
  fontFamily: monoStack,
  fontSize: '10px',
  letterSpacing: '0.25em',
  textTransform: 'uppercase' as const,
  color: '#3f3f3f',
  margin: 0,
}

// ---- Shared content styles for auth templates ----

export const h1Style = {
  fontFamily: fontStack,
  fontSize: '30px',
  fontWeight: 700,
  color: fgHigh,
  margin: '0 0 20px',
  letterSpacing: '-0.02em',
  textTransform: 'uppercase' as const,
  lineHeight: '1.1',
}
export const textStyle = {
  fontFamily: fontStack,
  fontSize: '15px',
  lineHeight: '24px',
  color: fgMid,
  margin: '0 0 20px',
}
export const inlineLink = {
  color: accent,
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
}
export const buttonWrap = {
  margin: '28px 0 32px',
}
export const buttonStyle = {
  backgroundColor: accent,
  color: '#080808',
  fontFamily: fontStack,
  fontWeight: 700,
  fontSize: '13px',
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  padding: '14px 22px',
  borderRadius: '4px',
  textDecoration: 'none',
  display: 'inline-block',
}
export const helperStyle = {
  fontFamily: monoStack,
  fontSize: '11px',
  lineHeight: '18px',
  letterSpacing: '0.05em',
  color: fgLow,
  margin: '20px 0 0',
}
export const codeBoxStyle = {
  fontFamily: monoStack,
  fontSize: '26px',
  fontWeight: 700,
  color: accent,
  margin: '8px 0 24px',
  letterSpacing: '0.4em',
  padding: '18px 24px',
  backgroundColor: surface,
  border: `1px solid ${border}`,
  display: 'inline-block',
  borderRadius: '4px',
}