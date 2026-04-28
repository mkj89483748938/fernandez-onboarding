'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'

const STORAGE_KEY = 'agent_setup_dismissed'

type Stage = 'question' | 'form' | 'done' | 'hidden'

export default function AgentSetupForm({ userEmail, userName }: { userEmail?: string; userName?: string }) {
  const [stage, setStage] = useState<Stage>('hidden')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: userName ?? '',
    email: userEmail ?? '',
    phone: '',
    license: '',
    mlsId: '',
    instagram: '',
    birthdayMonth: '',
    birthdayDay: '',
  })

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) setStage('question')
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setStage('hidden')
  }

  function handleNo() {
    setStage('form')
  }

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/submit-agent-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          birthday: form.birthdayMonth && form.birthdayDay ? `${form.birthdayMonth}/${form.birthdayDay}` : '',
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      localStorage.setItem(STORAGE_KEY, '1')
      setStage('done')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (stage === 'hidden') return null

  if (stage === 'done') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8 flex items-center gap-4">
        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-900">Info submitted</p>
          <p className="text-xs text-emerald-700 mt-0.5">We have everything we need to get you set up. You will hear from us shortly.</p>
        </div>
      </div>
    )
  }

  if (stage === 'question') {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8">
        <p className="text-sm font-semibold mb-1">Account Setup</p>
        <p className="text-sm text-zinc-600 mb-5">Have you already been set up with a Follow Up Boss, Ylopo, and Slack account?</p>
        <div className="flex gap-3">
          <button
            onClick={dismiss}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Yes, I am set up
          </button>
          <button
            onClick={handleNo}
            className="px-4 py-2 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 hover:border-zinc-500 transition-colors"
          >
            No, I need to be set up
          </button>
        </div>
      </div>
    )
  }

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1))

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8">
      <p className="text-sm font-semibold mb-1">Submit Your Info</p>
      <p className="text-xs text-zinc-500 mb-5">We will use this to get your accounts created on all platforms.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-medium text-zinc-600 block mb-1">Full Name <span className="text-red-500">*</span></label>
            <input
              required
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
              placeholder="Jane Smith"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-medium text-zinc-600 block mb-1">Email <span className="text-red-500">*</span></label>
            <input
              required
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
              placeholder="jane@email.com"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-medium text-zinc-600 block mb-1">Phone <span className="text-red-500">*</span></label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
              placeholder="(949) 555-0100"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-medium text-zinc-600 block mb-1">CA License # <span className="text-red-500">*</span></label>
            <input
              required
              value={form.license}
              onChange={e => set('license', e.target.value)}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
              placeholder="DRE #"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-medium text-zinc-600 block mb-1">MLS ID <span className="text-zinc-400 font-normal">(optional)</span></label>
            <input
              value={form.mlsId}
              onChange={e => set('mlsId', e.target.value)}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
              placeholder="MLS ID"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-medium text-zinc-600 block mb-1">Instagram <span className="text-zinc-400 font-normal">(optional)</span></label>
            <input
              value={form.instagram}
              onChange={e => set('instagram', e.target.value)}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500"
              placeholder="@handle"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-zinc-600 block mb-1">Birthday <span className="text-zinc-400 font-normal">(month and day only)</span></label>
            <div className="flex gap-2">
              <select
                value={form.birthdayMonth}
                onChange={e => set('birthdayMonth', e.target.value)}
                className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500 bg-white"
              >
                <option value="">Month</option>
                {months.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
              </select>
              <select
                value={form.birthdayDay}
                onChange={e => set('birthdayDay', e.target.value)}
                className="w-24 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-500 bg-white"
              >
                <option value="">Day</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={dismiss}
            className="text-xs text-zinc-400 hover:text-zinc-600"
          >
            Skip for now
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}
