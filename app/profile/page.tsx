'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2 } from 'lucide-react'

type Profile = {
  id: string
  full_name: string
  preferred_name: string | null
  email: string
  phone: string | null
  license_number: string | null
  headshot_url: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [fullName, setFullName] = useState('')
  const [preferredName, setPreferredName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setFullName(data.full_name ?? '')
        setPreferredName(data.preferred_name ?? '')
        setEmail(data.email ?? '')
        setPhone(data.phone ?? '')
        setLicenseNumber(data.license_number ?? '')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        preferred_name: preferredName || null,
        phone: phone || null,
        license_number: licenseNumber || null,
      })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Navbar />
        <div className="flex items-center justify-center py-32 text-zinc-400 text-sm">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Your Profile</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Complete your profile so the team can add you to all platforms.
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-2">
            {profile?.license_number
              ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              : <div className="w-5 h-5 rounded-full border-2 border-zinc-300 mt-0.5 shrink-0"></div>
            }
            <div>
              <p className="text-sm font-medium">Profile submitted</p>
              <p className="text-xs text-zinc-500">
                {profile?.license_number
                  ? 'Your info has been submitted. The team will add you to FUB, Ylopo, and Slack shortly.'
                  : 'Fill in your details below and save to notify the team.'
                }
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5 uppercase tracking-wider">Full Legal Name</label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} required className="h-10" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5 uppercase tracking-wider">Preferred Name</label>
              <Input value={preferredName} onChange={e => setPreferredName(e.target.value)} placeholder="How you want to appear" className="h-10" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5 uppercase tracking-wider">Email</label>
            <Input value={email} disabled className="h-10 opacity-60" />
            <p className="text-xs text-zinc-400 mt-1">Email is set at account creation and cannot be changed here.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5 uppercase tracking-wider">Phone Number</label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 000-0000" className="h-10" />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5 uppercase tracking-wider">DRE License Number</label>
            <Input value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="CA DRE #" className="h-10" />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={saving} className="h-10">
              {saving ? 'Saving…' : 'Save Profile'}
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                Saved
              </span>
            )}
          </div>
        </form>

        <div className="mt-6 bg-white border border-zinc-200 rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Headshot</p>
          <p className="text-sm text-zinc-600">
            Please email your professional headshot directly to the team lead.
            We recommend a recent, high-resolution photo on a neutral background.
          </p>
        </div>
      </div>
    </div>
  )
}
