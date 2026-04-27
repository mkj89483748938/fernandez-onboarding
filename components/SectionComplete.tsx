'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  moduleId: string
  sectionId: string
  completed: boolean
  label?: string
}

export default function SectionComplete({ moduleId, sectionId, completed: initial, label = 'Mark as Complete' }: Props) {
  const [done, setDone] = useState(initial)
  const [, startTransition] = useTransition()

  async function toggle() {
    const next = !done
    setDone(next)
    startTransition(async () => {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, sectionId, completed: next }),
      })
    })
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all',
        done
          ? 'bg-zinc-900 text-white border-zinc-900'
          : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-500'
      )}
    >
      <CheckCircle2 className={cn('w-4 h-4', done ? 'text-white' : 'text-zinc-400')} />
      {done ? 'Completed' : label}
    </button>
  )
}
