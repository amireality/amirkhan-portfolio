import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { sendTemplateEmail } from '@/lib/email-templates/send-email'

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(2000),
})

// naive in-memory rate limit per IP (per worker instance)
const hits = new Map<string, { count: number; reset: number }>()
const WINDOW_MS = 60_000
const MAX = 5

function rateLimited(ip: string) {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > MAX
}

export const Route = createFileRoute('/api/public/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get('cf-connecting-ip') ||
          request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          'unknown'

        if (rateLimited(ip)) {
          return Response.json({ error: 'Too many submissions, try again shortly.' }, { status: 429 })
        }

        let payload: unknown
        try {
          payload = await request.json()
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 })
        }

        const parsed = schema.safeParse(payload)
        if (!parsed.success) {
          return Response.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { name, email, message } = parsed.data
        const submittedAt = new Date().toISOString()
        const idBase = `${email}-${submittedAt}`

        try {
          // Notify Amir (fixed recipient on template). Reply-to = visitor.
          await sendTemplateEmail('contact-admin', 'amir@setupr.com', {
            templateData: { name, email, message, submittedAt },
            idempotencyKey: `contact-admin-${idBase}`,
            replyTo: email,
          })
        } catch (err) {
          console.error('contact-admin send failed', err)
          return Response.json({ error: 'Could not deliver message. Try again later.' }, { status: 502 })
        }

        // Visitor confirmation — never block the success response on this.
        try {
          await sendTemplateEmail('contact-confirmation', email, {
            templateData: { name, message },
            idempotencyKey: `contact-confirm-${idBase}`,
            replyTo: 'amir@setupr.com',
          })
        } catch (err) {
          console.error('contact-confirmation send failed', err)
        }

        return Response.json({ ok: true })
      },
    },
  },
})