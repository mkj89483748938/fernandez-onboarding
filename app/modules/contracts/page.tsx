import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import SectionComplete from '@/components/SectionComplete'

const MODULE_ID = 'contracts'

export default async function ContractsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: progress } = await supabase
    .from('module_progress')
    .select('section_id')
    .eq('user_id', user.id)
    .eq('module_id', MODULE_ID)
    .eq('completed', true)

  const completedIds = new Set((progress ?? []).map(r => r.section_id))
  const params = await searchParams
  const activeTab = params.tab ?? 'basics'

  const tabs = [
    { id: 'basics', label: 'Basics' },
    { id: 'forms', label: 'Common Forms' },
    { id: 'training', label: 'Training' },
  ]

  const forms = [
    {
      abbr: 'RPA',
      name: 'Residential Purchase Agreement',
      desc: 'The primary contract used when a buyer makes an offer on a property. It outlines price, contingencies, timelines, and all transaction terms.',
    },
    {
      abbr: 'RLA',
      name: 'Residential Listing Agreement',
      desc: 'Your contract with the seller. Authorizes you to market their property, establishes your commission, and defines the terms of the listing.',
    },
    {
      abbr: 'BRBC',
      name: 'Buyer Representation and Broker Compensation Agreement',
      desc: 'Establishes you as the buyer\'s agent and outlines how you will be compensated. Required before showing homes under the post-NAR settlement rules.',
    },
    {
      abbr: 'AVID',
      name: 'Agent Visual Inspection Disclosure',
      desc: 'Documents what you personally observed during your visual inspection of the property. Protects you legally and informs the buyer of visible conditions.',
    },
    {
      abbr: 'RR',
      name: 'Request for Repair',
      desc: 'Used by the buyer during the inspection contingency period to request repairs, a credit, or a price reduction based on inspection findings.',
    },
    {
      abbr: 'VP',
      name: 'Verification of Property Condition',
      desc: 'Confirms the property\'s condition before close of escrow. Typically completed during the final walkthrough to verify agreed repairs were completed.',
    },
    {
      abbr: 'MTLA',
      name: 'Modification of Terms to Listing Agreement',
      desc: 'Used to amend an active listing agreement - commonly to change the listing price, extend the listing period, or update commission terms.',
    },
    {
      abbr: 'MTBR',
      name: 'Modification of Terms to Buyer Representation',
      desc: 'Amends the buyer representation agreement. Used to update compensation terms, extend the agreement, or change the scope of representation.',
    },
    {
      abbr: 'Notice to Perform',
      name: 'Notice to Buyer/Seller to Perform',
      desc: 'Issued when a party has failed to meet a contract deadline. Gives them a short window (typically 2 days) to perform or the other party can cancel.',
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-1">Module 5</p>
          <h1 className="text-2xl font-semibold tracking-tight">Contract Basics</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Where to find forms, what they are, and how to get trained.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-200 pb-4">
          {tabs.map(tab => (
            <a
              key={tab.id}
              href={`?tab=${tab.id}`}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#2A7DB5] text-white'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>

        {/* Basics */}
        {activeTab === 'basics' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3">
              <h2 className="font-semibold">Where to Get Forms</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Your MLS / Realtor Membership gives you access to California CAR forms. We recommend using <strong>Glide</strong> as your primary tool - it makes it easy to draft documents, send for signatures, and add a transaction coordinator as a collaborator once you are in escrow.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3">
              <h2 className="font-semibold">What is Glide?</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Glide is a transaction management platform built specifically for real estate agents. It pulls CAR forms directly, guides you through completing them, handles e-signatures, and keeps everything organized in one place per transaction.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Once you are in escrow you can add your transaction coordinator as a collaborator so they can help manage deadlines and paperwork on your behalf.
              </p>
              <a
                href="https://www.glide.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2A7DB5] hover:underline"
              >
                Open Glide
              </a>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="basics" completed={completedIds.has('basics')} nextHref="?tab=forms" />
            </div>
          </div>
        )}

        {/* Common Forms */}
        {activeTab === 'forms' && (
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <p className="text-sm text-zinc-600 leading-relaxed">
                These are the forms you will encounter most often. Learn what each one is for so you know when to use them and can explain them to your clients.
              </p>
            </div>

            {forms.map(form => (
              <div key={form.abbr} className="bg-white border border-zinc-200 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#2A7DB5] text-white shrink-0 mt-0.5">
                    {form.abbr}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{form.name}</p>
                    <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{form.desc}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <SectionComplete moduleId={MODULE_ID} sectionId="forms" completed={completedIds.has('forms')} nextHref="?tab=training" />
            </div>
          </div>
        )}

        {/* Training */}
        {activeTab === 'training' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3">
              <h2 className="font-semibold">CAR Forms Tutor</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                The California Association of REALTORS® Forms Tutor walks you through every CAR form section by section. If you are unsure how to fill something out or what a field means, this is the first place to check.
              </p>
              <a
                href="https://www.car.org/transactions/ft"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2A7DB5] hover:underline"
              >
                Open CAR Forms Tutor
              </a>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3">
              <h2 className="font-semibold">Glide Training</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Glide offers on-demand webinar training videos covering how to use the platform from start to finish.
              </p>
              <a
                href="https://help.glide.com/en/articles/4950522-glide-webinar-training-videos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2A7DB5] hover:underline"
              >
                Watch Glide Training Videos
              </a>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3">
              <h2 className="font-semibold">eXp Contracts Training</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                eXp offers a <strong>weekly contracts training course in eXp World every Wednesday at 9:30 AM</strong>. This is a great resource whether you are brand new to contracts or just want to sharpen your skills.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                You can find all eXp University training sessions for California agents here:
              </p>
              <a
                href="https://www.expuniversity.com/ca-training-library"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2A7DB5] hover:underline"
              >
                eXp University - CA Training Library
              </a>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="training" completed={completedIds.has('training')} />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
