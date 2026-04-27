import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import SectionComplete from '@/components/SectionComplete'
import StagesComplete from '@/components/StagesComplete'

const MODULE_ID = 'follow-up-boss'

const ALL_STAGES = [
  { name: 'Lead', timeline: 'New — no contact yet', ai: true, desc: 'Brand new lead that has not been spoken with yet. AI immediately begins outreach. Your goal is to call within 5 minutes of the lead coming in.' },
  { name: 'A Hot', timeline: 'Within 90 days', ai: false, desc: 'Timeline is within 90 days. Call weekly and stay top of mind. This is your active pipeline — treat it like a job.' },
  { name: 'B Warm', timeline: '3–6 months', ai: false, desc: 'Timeline is 3–6 months out. Communicate every two weeks. Keep delivering value and watch for any change in urgency.' },
  { name: 'C Cold', timeline: '6+ months', ai: false, desc: 'Timeline is 6+ months. Cold leads are on action plans and remarketed via Ylopo. Check in monthly and let the system do the heavy lifting.' },
  { name: 'Contact', timeline: 'Long-term nurture', ai: true, desc: 'Not buying or selling anytime soon — just curious, likes looking at homes, already has an agent, or already bought. AI stays on for long-term nurture. You can still call manually.' },
  { name: 'Bad Phone Number', timeline: 'Moves to Contact', ai: false, desc: 'This will automatically move to the Contact stage and start the bad phone number automation. Verify their contact info and update it before moving them back to Lead.' },
  { name: 'Renter', timeline: 'Future buyer', ai: false, desc: 'Only looking to rent for now. Future buyer — keep them in your database and set a reminder to check in when their lease is likely up.' },
  { name: 'Appointment Set', timeline: 'Meeting on calendar', ai: false, desc: 'An appointment has been set — whether a listing appointment or a home showing. Move here the moment it is scheduled.' },
  { name: 'Met With Client', timeline: 'Consulted', ai: false, desc: 'You have met with this client but they are not yet actively shopping. Keep the relationship warm with regular personal follow-up.' },
  { name: 'Active Client', timeline: 'Actively working', ai: false, desc: 'Listing is signed or buyer is actively shopping for homes with you. This is your relationship — manage it personally.' },
  { name: 'Pending', timeline: 'In escrow', ai: false, desc: 'Fully executed contract and in escrow. Move here the day you open escrow.' },
  { name: 'Closed', timeline: 'Transaction complete', ai: false, desc: 'Deal is done. Move here on close of escrow. Start your past-client nurture and ask for a review and referral.' },
  { name: 'Trash', timeline: 'Admin only', ai: false, desc: 'DO NOT trash leads yourself. If you think a lead should go here, notify an admin. This designation is admin-only.' },
]

const SMART_LISTS = [
  { name: 'New', desc: 'All leads that just came in and have not been contacted yet. Work this list first every day.' },
  { name: 'Important', desc: 'Leads you have manually flagged as high priority. Use this to bookmark your most engaged prospects.' },
  { name: 'AI Replies', desc: 'Leads where Ylopo or FUB AI received a response. These are warm — call them within 5 minutes of the reply.' },
  { name: 'Hot', desc: 'All leads in the A Hot stage. 90-day timeline. Your active pipeline.' },
  { name: 'Warm', desc: 'All leads in the B Warm stage. 3–6 month timeline. Follow up bi-weekly.' },
  { name: 'Cold', desc: 'All leads in the C Cold stage. 6+ months out. Long-term nurture managed mostly by Ylopo.' },
  { name: 'Past Clients', desc: 'Closed clients. Stay in relationship. They are your referral engine and your repeat business.' },
]

export default async function FollowUpBossPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
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
  const activeTab = params.tab ?? 'philosophy'

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-1">Module 2</p>
          <h1 className="text-2xl font-semibold tracking-tight">Follow Up Boss</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Your CRM is the foundation of your business. Master it and you master your pipeline.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-200 pb-4">
          {['philosophy', 'stages', 'smart-lists', 'lead-view', 'best-practices'].map(tab => (
            <a
              key={tab}
              href={`?tab=${tab}`}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              {tab === 'philosophy' && 'Philosophy'}
              {tab === 'stages' && 'Stages'}
              {tab === 'smart-lists' && 'Smart Lists'}
              {tab === 'lead-view' && 'Lead View Dashboard'}
              {tab === 'best-practices' && 'Best Practices'}
            </a>
          ))}
        </div>

        {/* Philosophy */}
        {activeTab === 'philosophy' && (
          <div className="space-y-6">
            <div className="bg-zinc-900 text-white rounded-xl p-8 text-center">
              <p className="text-2xl font-semibold leading-tight">&ldquo;If it didn&apos;t happen in FUB,<br />it didn&apos;t happen.&rdquo;</p>
              <p className="text-zinc-400 text-sm mt-3">Every call, text, email, and note must be logged.</p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
              <h2 className="font-semibold">Why this matters</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Follow Up Boss is not just a contact list — it is your legal documentation, your accountability system,
                and your business intelligence tool. If you have a conversation with a lead and do not log it,
                that relationship is invisible to the team and invisible to you next time you call.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Leads go cold because agents forget context. FUB exists so you never have to forget.
                Every touchpoint is timestamped, every note is searchable, every deal has a paper trail.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                The team also reviews FUB activity to coach and support you. If nothing is logged,
                there is nothing to coach on.
              </p>
            </div>
            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="philosophy" completed={completedIds.has('philosophy')} nextHref="?tab=stages" />
            </div>
          </div>
        )}

        {/* Stages */}
        {activeTab === 'stages' && (
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <p className="text-sm text-zinc-600">
                AI only contacts leads in the <strong>Lead</strong> and <strong>Contact</strong> stages. All other stages require you to manage communication personally. Keep stages accurate — a wrong stage means the AI is either working leads it shouldn&apos;t, or silent when it should be nurturing.
              </p>
            </div>

            <div className="space-y-2">
              {ALL_STAGES.map((s, i) => (
                <div key={s.name} className="bg-white border border-zinc-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-zinc-400 w-5 shrink-0">{i + 1}.</span>
                    <span className="font-semibold text-sm">{s.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      s.ai
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                    }`}>
                      {s.ai ? 'AI Active' : 'AI Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-1 ml-5">{s.timeline}</p>
                  <p className="text-sm text-zinc-600 leading-relaxed ml-5">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">DNC Tag</p>
              <p className="text-sm text-zinc-600">If a lead asks not to be contacted, immediately apply the <strong>DNC</strong> tag. This moves them to the pond and removes them from all automated communications. Never call a DNC-tagged lead.</p>
            </div>

            <StagesComplete
              pairs={ALL_STAGES.map(s => ({ term: s.name, definition: s.desc }))}
              moduleId={MODULE_ID}
              sectionId="stages"
              completed={completedIds.has('stages')}
              nextHref="?tab=smart-lists"
            />
          </div>
        )}

        {/* Smart Lists */}
        {activeTab === 'smart-lists' && (
          <div className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <p className="text-sm text-zinc-600">
                Smart Lists are saved filtered views of your lead database. Instead of searching every time,
                you work from these lists each day. Think of them as your work queues.
              </p>
            </div>

            <div className="space-y-3">
              {SMART_LISTS.map((list, i) => (
                <div key={list.name} className="bg-white border border-zinc-200 rounded-xl p-5 flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500 shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">{list.name}</p>
                    <p className="text-sm text-zinc-600 leading-relaxed">{list.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Pro Tip</p>
              <p className="text-sm text-zinc-600">
                Work your lists in order: <strong>AI Replies</strong> first (hottest), then <strong>New</strong>,
                then <strong>Hot</strong>. Save Cold and Past Clients for later in your day or week.
              </p>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="smart-lists" completed={completedIds.has('smart-lists')} nextHref="?tab=lead-view" />
            </div>
          </div>
        )}

        {/* Lead View Dashboard */}
        {activeTab === 'lead-view' && (
          <div className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="font-semibold mb-2">Organizing Your Lead View for Maximum Efficiency</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                The Lead View is your day-to-day working screen in FUB. How you configure it determines
                how fast you can move through your pipeline without losing track of anyone.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-sm font-semibold mb-2">1. Pin Your Most-Used Smart Lists to the Sidebar</p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Keep AI Replies, New, Hot, and Warm pinned to the top of your sidebar so you can jump between them
                  with one click. Unpin lists you rarely use to reduce visual noise.
                </p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-sm font-semibold mb-2">2. Set Your Default Sort to Last Activity</p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Sort each list by &ldquo;Last Activity&rdquo; so the leads who engaged most recently float to the top.
                  This ensures you always call the warmest leads first without having to think about it.
                </p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-sm font-semibold mb-2">3. Use the Lead Detail Panel, Not a New Tab</p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Click a lead to open their detail panel on the right side of your screen. Stay in list view
                  so you can move quickly between leads. Avoid opening each lead in a new tab — it slows you down.
                </p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-sm font-semibold mb-2">4. Log a Note Before Moving On</p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  After every call or text, type a quick note directly in the lead detail panel before you move to
                  the next lead. Even two sentences — what they said, what the next step is. Future you will thank
                  present you.
                </p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-sm font-semibold mb-2">5. Update the Stage on Every Call</p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  If someone went from cold to warm on this call, change the stage right now — not later.
                  Stage accuracy keeps the AI behaving correctly and your smart lists accurate.
                </p>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-sm font-semibold mb-2">6. Use the &ldquo;Next Action&rdquo; Field as Your To-Do List</p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Set a Next Action date on every lead you talk to. This becomes your built-in follow-up calendar.
                  Start your day by filtering for &ldquo;Next Action = Today&rdquo; and work through that list before
                  moving to your smart lists.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 text-white rounded-xl p-6">
              <p className="text-sm font-semibold mb-2">Daily Workflow Order</p>
              <ol className="space-y-1 text-sm text-zinc-300">
                <li>1. Next Action = Today</li>
                <li>2. AI Replies (call within 5 min of reply)</li>
                <li>3. New Leads</li>
                <li>4. Hot (A) — any you have not touched this week</li>
                <li>5. Warm (B) — any you have not touched in 2 weeks</li>
              </ol>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="lead-view" completed={completedIds.has('lead-view')} nextHref="?tab=best-practices" />
            </div>
          </div>
        )}

        {/* Best Practices */}
        {activeTab === 'best-practices' && (
          <div className="space-y-4">
            {[
              {
                title: 'Speed to lead is everything',
                body: 'The first agent to call a new lead converts at a dramatically higher rate. When you see a new lead in FUB, your goal is to call within 5 minutes. Set up push notifications on your phone so you are alerted the moment a lead comes in.',
              },
              {
                title: 'Never skip a stage',
                body: 'Move leads through stages in sequence. Do not jump a lead from "Lead" to "Active Client" — the middle stages matter for AI behavior and for your own tracking. Each stage tells a story about where this person is in their journey.',
              },
              {
                title: 'Log every attempted contact',
                body: 'Even if no one answered, log it. "Called, no answer. Left VM." This documents your effort and starts the clock on your follow-up cadence.',
              },
              {
                title: 'Tag strategically',
                body: 'Tags are searchable and filter-able. Use them to group leads by neighborhood, price range, or special circumstances. Keep your tag list clean — avoid creating one-off tags you will never use again.',
              },
              {
                title: 'Use the mobile app when you are in the field',
                body: 'The FUB mobile app lets you log calls and notes immediately after a showing or meeting. Do not wait until you are back at your desk — context fades fast.',
              },
              {
                title: 'Review your pipeline every Monday',
                body: 'At the start of each week, look at your Hot and Warm lists and decide who needs a personal call this week. Block time on your calendar for it so it actually happens.',
              },
            ].map(item => (
              <div key={item.title} className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-sm font-semibold mb-1.5">{item.title}</p>
                <p className="text-sm text-zinc-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <SectionComplete moduleId={MODULE_ID} sectionId="best-practices" completed={completedIds.has('best-practices')} />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
