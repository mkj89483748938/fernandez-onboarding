'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import DarkModeToggle from '@/components/DarkModeToggle'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/modules/exp-signup', label: 'First Steps' },
  { href: '/modules/follow-up-boss', label: 'Follow Up Boss' },
  { href: '/modules/ylopo', label: 'Ylopo' },
  { href: '/modules/lead-conversion', label: 'Lead Conversion' },
  { href: '/modules/contracts', label: 'Contracts' },
  { href: '/modules/exp-resources', label: 'eXp Resources' },
]

export default function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b border-zinc-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex flex-col leading-none">
            <span className="text-[10px] tracking-[0.15em] uppercase text-zinc-400">eXp Realty</span>
            <span className="text-sm font-semibold tracking-tight">The Fernandez Group</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'bg-[#2A7DB5] text-white'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="text-xs h-8">Admin</Button>
            </Link>
          )}
          <DarkModeToggle />
          <Link href="/profile">
            <Button variant="outline" size="sm" className="text-xs h-8">Profile</Button>
          </Link>
          <Button variant="ghost" size="sm" className="text-xs h-8" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}
