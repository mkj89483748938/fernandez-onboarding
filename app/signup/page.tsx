'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-2">eXp Realty</p>
          <h1 className="text-2xl font-semibold tracking-tight">The Fernandez Group</h1>
          <p className="text-sm text-zinc-500 mt-1">Create your agent account</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5 uppercase tracking-wider">Full Name</label>
            <Input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              placeholder="Jane Smith"
              className="h-11"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5 uppercase tracking-wider">Email</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="h-11"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5 uppercase tracking-wider">Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="h-11"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-zinc-900 font-medium underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
