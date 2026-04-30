import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { MODULES } from '@/lib/modules'
import { getModuleProgress } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: progress } = await supabase
    .from('module_progress')
    .select('module_id, section_id')
    .eq('user_id', user.id)
    .eq('completed', true)

  const completedByModule: Record<string, number> = {}
  for (const row of (progress ?? [])) {
    completedByModule[row.module_id] = (completedByModule[row.module_id] ?? 0) + 1
  }

  const totalSections = MODULES.reduce((sum, m) => sum + m.totalSections, 0)
  const totalCompleted = Object.values(completedByModule).reduce((a, b) => a + b, 0)
  const overallPct = getModuleProgress(totalCompleted, totalSections)

  const name = profile?.preferred_name || profile?.full_name || 'Agent'

  // Find the first module that isn't fully complete
  const nextModule = MODULES.find(m => (completedByModule[m.id] ?? 0) < m.totalSections) ?? MODULES[0]
  const hasStarted = totalCompleted > 0

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-1">Welcome back</p>
            <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
            <p className="text-zinc-500 mt-1 text-sm">Complete all modules to finish your onboarding.</p>
          </div>
          <Link
            href={nextModule.href}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2A7DB5] text-white text-sm font-medium hover:bg-[#1E6A9E] transition-colors mt-1"
          >
            {hasStarted ? 'Continue' : 'Get Started'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Overall Progress */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-semibold">{overallPct}%</span>
          </div>
          <Progress value={overallPct} className="h-2" />
          <p className="text-xs text-zinc-400 mt-2">{totalCompleted} of {totalSections} sections complete</p>
        </div>

        {/* Module Cards */}
        <div className="space-y-3">
          {MODULES.map(mod => {
            const completed = completedByModule[mod.id] ?? 0
            const pct = getModuleProgress(completed, mod.totalSections)
            const isComplete = completed >= mod.totalSections

            return (
              <Link key={mod.id} href={mod.href}>
                <div className="bg-white border border-zinc-200 rounded-xl p-5 flex items-center gap-5 hover:border-zinc-400 transition-all group cursor-pointer">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-zinc-200 shrink-0 group-hover:border-zinc-900 transition-colors">
                    {isComplete
                      ? <CheckCircle2 className="w-5 h-5 text-zinc-900" />
                      : <span className="text-sm font-semibold text-zinc-500">{mod.number}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-sm font-semibold">{mod.title}</h2>
                      <span className="text-xs text-zinc-400 shrink-0 ml-2">{pct}%</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-2 truncate">{mod.description}</p>
                    <Progress value={pct} className="h-1" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors shrink-0" />
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </div>
  )
}
