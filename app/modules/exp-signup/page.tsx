import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ProgressTracker from '@/components/ProgressTracker'
import AgentSetupForm from '@/components/AgentSetupForm'

const MODULE_ID = 'exp-signup'

const CHECKLIST_ITEMS = [
  {
    id: 'commit-ownership',
    label: 'Ownership & Team Contribution',
    description: 'I commit to showing up as a professional, contributing to the team, and taking ownership of my results.',
  },
  {
    id: 'commit-daily-activity',
    label: 'Daily Activity Standard',
    description: 'I commit to completing a minimum of 50 dials per day in Follow Up Boss and logging all activity accurately.',
  },
  {
    id: 'commit-prospecting',
    label: 'Prospecting Discipline',
    description: 'I commit to dedicating at least 1 focused hour every day to proactive prospecting - no distractions, no excuses.',
  },
  {
    id: 'commit-database',
    label: 'Database & Follow-Up Excellence',
    description: 'I commit to updating my leads, notes, and stages consistently and following up based on team best practices.',
  },
  {
    id: 'commit-consistency',
    label: 'Consistency',
    description: 'I commit to staying consistent, even when results are not immediate, knowing that pipeline is built through daily action.',
  },
]

export default async function ExpSignupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: progress } = await supabase
    .from('module_progress')
    .select('section_id')
    .eq('user_id', user.id)
    .eq('module_id', MODULE_ID)
    .eq('completed', true)

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const completedIds = (progress ?? []).map(r => r.section_id)

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">

        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-1">Module 1</p>
          <h1 className="text-2xl font-semibold tracking-tight">First Steps</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Submit your info and check off each commitment below to get started.
          </p>
        </div>

        <AgentSetupForm userEmail={user.email} userName={profile?.full_name ?? ''} />

        <div className="mb-6">
          <p className="text-sm font-semibold mb-1">Team Commitments</p>
          <p className="text-xs text-zinc-500 mb-4">Check each box to acknowledge your commitment to the team standards.</p>
          <ProgressTracker
            moduleId={MODULE_ID}
            items={CHECKLIST_ITEMS}
            completedIds={completedIds}
            onAllCompleteHref="/modules/follow-up-boss"
          />
        </div>

      </div>
    </div>
  )
}
