'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle } from 'lucide-react'

type Item = {
  id: string
  label: string
  description?: string
}

type Props = {
  moduleId: string
  items: Item[]
  completedIds: string[]
  onAllCompleteHref?: string
}

export default function ProgressTracker({ moduleId, items, completedIds, onAllCompleteHref }: Props) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(completedIds))
  const [, startTransition] = useTransition()
  const router = useRouter()

  async function toggle(sectionId: string) {
    const isNowCompleted = !completed.has(sectionId)
    setCompleted(prev => {
      const next = new Set(prev)
      isNowCompleted ? next.add(sectionId) : next.delete(sectionId)
      if (onAllCompleteHref && isNowCompleted && next.size === items.length) {
        setTimeout(() => router.push(onAllCompleteHref), 600)
      }
      return next
    })
    startTransition(async () => {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, sectionId, completed: isNowCompleted }),
      })
    })
  }

  return (
    <div className="space-y-2">
      {items.map(item => {
        const done = completed.has(item.id)
        return (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className={cn(
              'w-full flex items-start gap-3 p-4 rounded-lg border text-left transition-all',
              done
                ? 'border-[#2A7DB5] bg-[#2A7DB5] text-white'
                : 'border-zinc-200 bg-white hover:border-zinc-400 text-zinc-900'
            )}
          >
            <span className="mt-0.5 shrink-0">
              {done
                ? <CheckCircle2 className="w-5 h-5 text-white" />
                : <Circle className="w-5 h-5 text-zinc-400" />
              }
            </span>
            <span className="flex flex-col gap-0.5">
              <span className={cn('text-sm font-medium', done ? 'line-through opacity-70' : '')}>
                {item.label}
              </span>
              {item.description && (
                <span className={cn('text-xs', done ? 'opacity-50' : 'text-zinc-500')}>
                  {item.description}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
