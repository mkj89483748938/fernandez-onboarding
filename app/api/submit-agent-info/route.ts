import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL
  if (!webhookUrl) {
    console.error('GOOGLE_SHEET_WEBHOOK_URL is not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const body = await req.json()

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    console.log('Apps Script response:', res.status, text)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Sheet submission error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
