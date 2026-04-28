'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('dark_mode')
    if (stored === '1') {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('dark_mode', '1')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('dark_mode', '0')
    }
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center w-8 h-8 rounded-md border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-colors"
      aria-label="Toggle dark mode"
    >
      {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
    </button>
  )
}
