'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  moduleId: string
  sectionId: string
  completed: boolean
  label?: string
  nextHref?: string
  disabled?: boolean
}

export default function SectionComplete({
  moduleId,
  sectionId,
  completed: initial,
  label = 'Mark as Complete',
  nextHref,
  disabled = false,
}: Props) {
  const [done, setDone] = useState(initial)
  const [, startTransition] = useTransition()
  const router = useRouter()

  async function toggle() {
    if (disabled) return
    const next = !done
    setDone(next)
    startTransition(async () => {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, sectionId, completed: next }),
      })
    })
    if (next && nextHref) {
      setTimeout(() => router.push(nextHref), 400)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all',
        done
          ? 'bg-zinc-900 text-white border-zinc-900'
          : disabled
          ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed'
          : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-500'
      )}
    >
      <CheckCircle2 className={cn('w-4 h-4', done ? 'text-white' : 'text-zinc-400')} />
      {done ? 'Completed' : label}
    </button>
  )
}
