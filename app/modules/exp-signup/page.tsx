import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ProgressTracker from '@/components/ProgressTracker'
import { ExternalLink } from 'lucide-react'

const MODULE_ID = 'exp-signup'

const CHECKLIST_ITEMS = [
  {
    id: 'step-1-signup',
    label: 'Sign up at joinapp.exprealty.com',
    description: 'Click the link, complete the eXp application, and pay your sign-up fees. Select The Fernandez Group as your team during the process.',
  },
  {
    id: 'step-2-dre',
    label: 'Transfer your license with the DRE',
    description: 'Submit a Salesperson Change form (RE 214) to the California DRE to transfer your license to eXp Realty. This can be done online at dre.ca.gov. Processing typically takes 2–5 business days.',
  },
  {
    id: 'step-3-notify',
    label: 'Notify the team once your license transfer is complete',
    description: 'Text or message the team lead when the DRE transfer is confirmed. Do not start working leads until this step is done.',
  },
  {
    id: 'step-4-info',
    label: 'Submit your agent info to the team',
    description: 'Provide your preferred name, email, phone number, DRE license number, and a professional headshot. Use the Profile page in this portal to submit your info.',
  },
  {
    id: 'step-5-platforms',
    label: 'Wait for team setup (FUB, Ylopo, Slack, roster)',
    description: 'Once we receive your info, we will add you to Follow Up Boss, Ylopo, the team Slack workspace, and the team roster. You will receive separate invite emails for each platform.',
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

  const completedIds = (progress ?? []).map(r => r.section_id)

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">

        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-1">Module 1</p>
          <h1 className="text-2xl font-semibold tracking-tight">eXp Realty Signup</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Complete each step below to join eXp and get set up with the team. Check off each item as you finish it.
          </p>
        </div>

        {/* Quick Link */}
        <div className="bg-zinc-900 text-white rounded-xl p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Ready to sign up?</p>
            <p className="text-xs text-zinc-400 mt-0.5">Start your eXp application here</p>
          </div>
          <a
            href="https://joinapp.exprealty.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium bg-white text-zinc-900 px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors whitespace-nowrap"
          >
            joinapp.exprealty.com
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <ProgressTracker
          moduleId={MODULE_ID}
          items={CHECKLIST_ITEMS}
          completedIds={completedIds}
        />

        {/* Important Note */}
        <div className="mt-8 border border-zinc-200 rounded-xl p-5 bg-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Important</p>
          <p className="text-sm text-zinc-700 leading-relaxed">
            You must have your license actively transferred to eXp Realty before showing homes,
            writing offers, or contacting leads on behalf of the team. If you have questions about
            the DRE transfer process, reach out to the team lead directly.
          </p>
        </div>

      </div>
    </div>
  )
}
