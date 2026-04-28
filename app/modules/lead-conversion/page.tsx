import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import SectionComplete from '@/components/SectionComplete'

const MODULE_ID = 'lead-conversion'

export default async function LeadConversionPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
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
  const activeTab = params.tab ?? 'mindset'

  const tabs = [
    { id: 'mindset', label: 'Mindset' },
    { id: 'opening-scripts', label: 'Opening Scripts' },
    { id: 'framework', label: 'The Framework' },
    { id: 'objections', label: 'Objection Handlers' },
    { id: 'appointment', label: 'Getting the Appointment' },
    { id: 'discovery', label: 'Discovery Questions' },
    { id: 'follow-up', label: 'Follow-Up' },
    { id: 'mindset-check', label: 'Mindset Check' },
  ]

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-1">Module 4</p>
          <h1 className="text-2xl font-semibold tracking-tight">Lead Conversion</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Scripts, frameworks, and objection handlers for both buyer and seller leads.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-200 pb-4">
          {tabs.map(tab => (
            <a
              key={tab.id}
              href={`?tab=${tab.id}`}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>

        {/* Mindset */}
        {activeTab === 'mindset' && (
          <div className="space-y-5">
            <div className="bg-zinc-900 text-white rounded-xl p-8 text-center">
              <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-4">The Mindset Shift</p>
              <p className="text-3xl font-semibold">Stop Selling.<br />Start Consulting.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-3">Old Way</p>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li>Always Be Closing</li>
                  <li>Push. Overcome. Win today.</li>
                  <li>Get the listing or the buyer  -  now</li>
                  <li>Overcome every objection</li>
                </ul>
              </div>
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-3">New Way</p>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li>Always Be Consulting</li>
                  <li>Build the relationship first</li>
                  <li>Be their advisor, not a closer</li>
                  <li>Understand every objection</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
              <h2 className="font-semibold">Why This Matters  -  For Both Buyers and Sellers</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Most buyers are 1–6 months from being ready to tour homes. Most sellers are 1–12 months
                from listing. Push them to act today and you lose them forever. Consult them today  -  be
                the expert helping them plan  -  and you earn the deal when they are ready.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                <strong>For sellers:</strong> Their home is their largest asset and they have no trusted
                advisor watching it for them. You are that advisor. Act like it. Do not call to get a listing.
                Call to help them plan.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                <strong>For buyers:</strong> They are making the biggest financial decision of their lives,
                often with very little information. Position yourself as the guide who simplifies the process
                and protects them  -  not as the salesperson trying to close them.
              </p>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="mindset" completed={completedIds.has('mindset')} nextHref="?tab=opening-scripts" />
            </div>
          </div>
        )}

        {/* Opening Scripts */}
        {activeTab === 'opening-scripts' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Rule #1</p>
              <p className="text-lg font-semibold">Never open with &ldquo;Are you looking to buy/sell?&rdquo;</p>
              <p className="text-sm text-zinc-500 mt-1">It kills the conversation immediately. Do not do it  -  not once.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-zinc-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">Buyer Lead</span>
                  <span className="text-xs text-zinc-400">Website/search activity</span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Script</p>
                <div className="bg-zinc-50 rounded-lg p-4 text-sm text-zinc-700 leading-relaxed italic">
                  &ldquo;Hi [Name], this is [Your Name] with The Fernandez Group. I saw you were searching on our site  - 
                  I just wanted to reach out and see if you found anything you liked, or if there&apos;s a specific
                  area or type of home I can help you narrow things down on.&rdquo;
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">Seller Lead</span>
                  <span className="text-xs text-zinc-400">AI conversation / home value inquiry</span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Script</p>
                <div className="bg-zinc-50 rounded-lg p-4 text-sm text-zinc-700 leading-relaxed italic">
                  &ldquo;Hi [Name], this is [Your Name] with The Fernandez Group. You were chatting with my assistant
                  about your home on [Street Name]. I wanted to continue that conversation and find out a bit
                  more about what you had in mind.&rdquo;
                </div>
                <p className="text-xs text-zinc-400 mt-3">
                  Use the street name, not the full address. Familiar, not invasive. It triggers recognition without alarm.
                </p>
              </div>

              <div className="bg-white border border-zinc-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 bg-zinc-100 text-zinc-700 rounded-full border border-zinc-200">Any Lead</span>
                  <span className="text-xs text-zinc-400">Older / inactive</span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Script</p>
                <div className="bg-zinc-50 rounded-lg p-4 text-sm text-zinc-700 leading-relaxed italic">
                  &ldquo;Hi [Name], this is [Your Name] with eXp Realty  -  you were on our website a while back.
                  I&apos;m just calling to see if you are still on the market or if you found what you were looking for.&rdquo;
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Two Responses  -  Both Work</p>
              <p className="text-sm text-zinc-600">
                &ldquo;Oh yeah&rdquo; or &ldquo;Who?&rdquo;  -  either way, you are in. You have a reason to be on the phone.
                Do not panic when they do not recognize you. Just keep going naturally.
              </p>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="opening-scripts" completed={completedIds.has('opening-scripts')} nextHref="?tab=framework" />
            </div>
          </div>
        )}

        {/* Framework */}
        {activeTab === 'framework' && (
          <div className="space-y-5">
            <div className="bg-zinc-900 text-white rounded-xl p-6 text-center">
              <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-3">The Framework</p>
              <div className="flex items-center justify-center gap-4 text-lg font-semibold">
                <span>Affirm</span>
                <span className="text-zinc-600">→</span>
                <span>Understand</span>
                <span className="text-zinc-600">→</span>
                <span>Pivot</span>
              </div>
              <p className="text-zinc-400 text-sm mt-3">Three steps. Every call. Every objection. Every time.</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Affirm',
                  color: 'bg-blue-50 border-blue-200',
                  badge: 'bg-blue-100 text-blue-700',
                  desc: 'Validate their objection completely. Kill the sales energy. Let them exhale. They expected a salesperson  -  you give them a human.',
                  buyerEx: '"I\'m so glad you\'re not ready yet. That means we have time to find the right home without rushing."',
                  sellerEx: '"I\'m so glad you\'re being thoughtful about the timing. That\'s exactly how you maximize what you walk away with."',
                },
                {
                  step: '2',
                  title: 'Understand',
                  color: 'bg-amber-50 border-amber-200',
                  badge: 'bg-amber-100 text-amber-700',
                  desc: 'Get curious. Do NOT overcome the objection. Ask questions. Find their story. Their answer tells you exactly how to be relevant to them.',
                  buyerEx: '"What would the perfect scenario look like for your move? What\'s been the biggest challenge in the search so far?"',
                  sellerEx: '"How did you land on that timeline? What would need to happen for you to feel ready to move?"',
                },
                {
                  step: '3',
                  title: 'Pivot with Value',
                  color: 'bg-emerald-50 border-emerald-200',
                  badge: 'bg-emerald-100 text-emerald-700',
                  desc: 'Offer something genuinely helpful. Assume they want it  -  do not ask "would you like it?" Just offer it and assume the yes.',
                  buyerEx: '"I want to send you a list of homes that just came on the market in that area  -  what\'s your email?"',
                  sellerEx: '"I have a report that shows your home\'s current value and how many buyers are looking right now. What\'s your email?"',
                },
              ].map(f => (
                <div key={f.step} className={`bg-white border rounded-xl p-6 ${f.color}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${f.badge}`}>Step {f.step}</span>
                    <span className="font-semibold">{f.title}</span>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-4">{f.desc}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-zinc-100">
                      <p className="text-xs font-semibold text-blue-600 mb-1.5">Buyer Example</p>
                      <p className="text-sm text-zinc-600 italic">{f.buyerEx}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-zinc-100">
                      <p className="text-xs font-semibold text-emerald-600 mb-1.5">Seller Example</p>
                      <p className="text-sm text-zinc-600 italic">{f.sellerEx}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="framework" completed={completedIds.has('framework')} nextHref="?tab=objections" />
            </div>
          </div>
        )}

        {/* Objections */}
        {activeTab === 'objections' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <p className="text-sm text-zinc-600">
                Every objection follows the same pattern: <strong>Affirm → Understand → Pivot.</strong>{' '}
                Below are the five most common objections you will hear, with responses for both buyer and seller scenarios.
              </p>
            </div>

            {[
              {
                title: 'Objection 1: "I\'m Not Ready"',
                affirm: 'That\'s great  -  I specialize in helping people who are just starting to plan. You called the right person.',
                buyerUnderstand: '"What\'s the main thing that needs to happen before you feel ready to start looking?"',
                sellerUnderstand: '"Where would you move to if you did sell? What\'s driving your timeline?"',
                buyerPivot: '"Let me put together a list of homes in your price range so you know what\'s out there when the time comes. What\'s your email?"',
                sellerPivot: '"Let me send you a report that tracks your home\'s value month over month so you can watch it as you plan. What\'s your email?"',
                note: 'Many people who say "a year from now" list or buy in 1–2 months once they see their numbers and understand the process. Stay in the game.',
              },
              {
                title: 'Objection 2: "Not Interested" / Hangs Up',
                affirm: null,
                buyerUnderstand: null,
                sellerUnderstand: null,
                buyerPivot: null,
                sellerPivot: null,
                note: null,
                custom: true,
                content: (
                  <div className="space-y-4">
                    <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3">
                      <p className="text-sm font-semibold">The Right Mindset</p>
                      <p className="text-sm text-zinc-600">A &ldquo;no&rdquo; is about their moment, not about you. Bad day, busy, sick kids, wrong time. Do not build a shame story. Do not avoid calling back.</p>
                      <p className="text-sm text-zinc-600">Call again in a few days. They will not remember. If Ylopo AI had a real back-and-forth conversation with them  -  chase them. Multiple attempts that week.</p>
                    </div>
                    <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3">
                      <p className="text-sm font-semibold">Re-Engagement Sequence</p>
                      <div className="space-y-2">
                        <div className="flex gap-3">
                          <span className="text-xs font-semibold text-zinc-400 w-20 shrink-0 pt-0.5">Morning Text</span>
                          <p className="text-sm text-zinc-600 italic">&ldquo;I have a couple things to share with you about [homes in your area / your home value]. Do you have 5 minutes?&rdquo;  -  Let curiosity do the work.</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-xs font-semibold text-zinc-400 w-20 shrink-0 pt-0.5">Afternoon Call</span>
                          <p className="text-sm text-zinc-600">Now you have a reason to call. The text created the warm entry point.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: 'Objection 3: "I Don\'t Own This Home"',
                affirm: 'No problem at all  -  thank you for letting me know.',
                buyerUnderstand: '"How long have you been renting? Have you ever thought about buying?"',
                sellerUnderstand: '"Do you happen to know who owns [street name]? Are you in contact with them?"',
                buyerPivot: '"We help a lot of first-time buyers navigate the process. If you\'re ever curious about what it would take to own, I\'m a great resource. What\'s your email?"',
                sellerPivot: 'If they know the owner, ask for a referral. Every call has conversion potential  -  the category might change, but the opportunity does not.',
                note: 'Never hang up on someone just because they aren\'t the owner. Ask one more question  -  always.',
              },
              {
                title: 'Objection 4: "I Already Have an Agent"',
                affirm: 'Great  -  I\'m glad you have someone in your corner.',
                buyerUnderstand: '"Are you actively working with them now, or is that someone from a past deal?"',
                sellerUnderstand: '"Are you actively working with them on a listing, or is this someone from a past transaction?"',
                buyerPivot: '"I totally respect that. I\'d love to be a backup resource if you ever need a second opinion. I\'ll send you my contact info  -  no pressure at all."',
                sellerPivot: '"I totally understand. If anything ever changes or you want a second opinion on pricing, I\'m here. I\'ll shoot you my contact info."',
                note: 'It\'s usually someone they used years ago  -  not exclusive, not active. The door is often more open than they let on. Ask the question.',
              },
              {
                title: 'Objection 5: "What Are Rates Right Now?" / Market Questions',
                affirm: 'Great question  -  and rates do play a big role in this decision.',
                buyerUnderstand: '"Before we get into the numbers  -  what has you thinking about making a move? Is there something specific driving the timing for you?"',
                sellerUnderstand: '"Absolutely. The market data actually makes a really strong case right now  -  but before I get into that, what\'s got you thinking about selling?"',
                buyerPivot: '"I\'ll connect you with our lender who can run your exact numbers  -  that\'s way more useful than a general rate. But first, tell me more about what you\'re looking for."',
                sellerPivot: '"I have a market report that shows exactly what homes like yours are selling for right now. Can I send that to you? What\'s your email?"',
                note: 'When a lead steers toward rates and data, they\'re often using it to avoid talking about their real motivation. Always lead with "why they\'re moving" before answering data questions. You can always send the data after.',
              },
            ].map((obj) => (
              <div key={obj.title} className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                <div className="bg-zinc-900 text-white px-5 py-3">
                  <p className="text-sm font-semibold">{obj.title}</p>
                </div>
                <div className="p-5 space-y-4">
                  {obj.custom ? obj.content : (
                    <>
                      {obj.affirm && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Affirm</p>
                          <p className="text-sm text-zinc-600 italic bg-zinc-50 rounded-lg p-3">&ldquo;{obj.affirm}&rdquo;</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-semibold text-blue-600 mb-1.5">Buyer: Understand</p>
                          <p className="text-sm text-zinc-600 italic bg-blue-50 rounded-lg p-3">{obj.buyerUnderstand}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-emerald-600 mb-1.5">Seller: Understand</p>
                          <p className="text-sm text-zinc-600 italic bg-emerald-50 rounded-lg p-3">{obj.sellerUnderstand}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-600 mb-1.5">Buyer: Pivot</p>
                          <p className="text-sm text-zinc-600 italic bg-blue-50 rounded-lg p-3">{obj.buyerPivot}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-emerald-600 mb-1.5">Seller: Pivot</p>
                          <p className="text-sm text-zinc-600 italic bg-emerald-50 rounded-lg p-3">{obj.sellerPivot}</p>
                        </div>
                      </div>
                      {obj.note && (
                        <div className="bg-zinc-50 rounded-lg p-3">
                          <p className="text-xs font-semibold text-zinc-400 mb-1">Remember</p>
                          <p className="text-xs text-zinc-600">{obj.note}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="objections" completed={completedIds.has('objections')} nextHref="?tab=appointment" />
            </div>
          </div>
        )}

        {/* Appointment */}
        {activeTab === 'appointment' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="font-semibold mb-2">Getting the Appointment</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                The goal is never to pressure someone into an appointment. The goal is to offer so much value
                that getting on the calendar feels like the natural next step. Always come from a place of helping,
                not selling.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed mt-2">
                The key is to <strong>affirm that they are not ready</strong>, then offer a strategy session
                that meets them exactly where they are. Buyers get a planning session. Sellers get a home walkthrough.
                Neither feels like a sales appointment  -  both are genuinely useful.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              <div className="bg-blue-900 text-white px-5 py-3">
                <p className="text-sm font-semibold">For Buyer Leads  -  Strategy Session</p>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Offer a no-pressure planning meeting  -  in person at the office or on Zoom.
                  Frame it as education, not a sales pitch.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-blue-600 mb-2">Script</p>
                  <p className="text-sm text-zinc-700 italic leading-relaxed">
                    &ldquo;Yeah, I totally get it  -  you&apos;re not ready to make a move anytime soon, and that&apos;s actually perfect.
                    A lot of my clients find that planning early makes the whole process way less stressful.
                    We specialize in helping people like you who [insert their concern  -  tight budget, need to sell first, first-time buyer, etc.].
                    I&apos;d love to set up a quick strategy session  -  we can do it in the office or on Zoom, whatever&apos;s easier.
                    I do these on Wednesdays and Saturdays  -  which works better for you?
                    I&apos;d hate for you to be guessing your way through such a big purchase.&rdquo;
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-zinc-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-zinc-500 mb-1">What You Cover</p>
                    <ul className="text-xs text-zinc-600 space-y-1">
                      <li>• The buying process end-to-end</li>
                      <li>• How to get pre-approved</li>
                      <li>• What to look for in a home</li>
                      <li>• Current market conditions</li>
                      <li>• Your role as their advocate</li>
                    </ul>
                  </div>
                  <div className="bg-white border border-zinc-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-zinc-500 mb-1">Why It Works</p>
                    <ul className="text-xs text-zinc-600 space-y-1">
                      <li>• No pressure  -  just information</li>
                      <li>• They leave more confident</li>
                      <li>• You become the trusted expert</li>
                      <li>• Natural path to signing a buyer agreement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              <div className="bg-emerald-900 text-white px-5 py-3">
                <p className="text-sm font-semibold">For Seller Leads  -  Pre-Listing Home Walkthrough</p>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-zinc-600 leading-relaxed">
                  For sellers who are 6–12 months out, offer a free pre-listing walkthrough. Position it as saving them
                  money  -  not as a listing pitch.
                </p>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-emerald-600 mb-2">Script</p>
                  <p className="text-sm text-zinc-700 italic leading-relaxed">
                    &ldquo;Yeah, I totally get it  -  you&apos;re not ready to move anytime soon, and that&apos;s totally fine.
                    We actually specialize in helping people who aren&apos;t quite ready yet.
                    One thing I find is that a lot of sellers waste money fixing things before they list that buyers honestly don&apos;t care about.
                    Something we offer  -  and our clients find a lot of value in it  -  is a quick pre-listing walkthrough.
                    I just come by the home for about 10–15 minutes, take a look around, and give you some tips on what
                    will actually matter when it comes time to list  -  even if that&apos;s six months or a year from now.
                    I do these on Wednesdays and Saturdays  -  which works better for you?&rdquo;
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-zinc-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-zinc-500 mb-1">What You Cover</p>
                    <ul className="text-xs text-zinc-600 space-y-1">
                      <li>• What buyers actually care about</li>
                      <li>• Low-cost, high-impact improvements</li>
                      <li>• What NOT to spend money on</li>
                      <li>• Timeline and pricing overview</li>
                    </ul>
                  </div>
                  <div className="bg-white border border-zinc-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-zinc-500 mb-1">Why It Works</p>
                    <ul className="text-xs text-zinc-600 space-y-1">
                      <li>• 10–15 min  -  no big ask</li>
                      <li>• You are in their home, not a sales call</li>
                      <li>• Saves them real money</li>
                      <li>• You are the agent when they list</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 text-white rounded-xl p-5">
              <p className="text-sm font-semibold mb-2">The Two-Option Close</p>
              <p className="text-sm text-zinc-300">
                Always offer two time options  -  never ask &ldquo;when are you free?&rdquo;<br />
                <em>&ldquo;I do these on Wednesdays or Saturdays  -  which works better for you?&rdquo;</em><br />
                This keeps the momentum going and makes booking feel easy, not like a commitment.
              </p>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="appointment" completed={completedIds.has('appointment')} nextHref="?tab=discovery" />
            </div>
          </div>
        )}

        {/* Discovery Questions */}
        {activeTab === 'discovery' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="font-semibold mb-2">Discovery Questions</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Ask open-ended questions only. Your goal is to understand their story, not pitch yours.
                The agent who understands the lead best wins the deal  -  not the one who talked the most.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">Buyer Questions</span>
                </div>
                <div className="space-y-2">
                  {[
                    'What are you hoping to change about where you live now?',
                    'What would the perfect scenario look like for your home purchase?',
                    'How did you decide on that timeline?',
                    'What areas have you been looking at  -  and what do you like about them?',
                    'What\'s most important to you in the home itself?',
                    'Have you been pre-approved yet, or is that something you\'re working on?',
                    'If you found the perfect home tomorrow, would you be able to move on it?',
                    'Tell me more about that…',
                  ].map((q, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-zinc-300 text-sm mt-0.5">→</span>
                      <p className="text-sm text-zinc-600 italic">&ldquo;{q}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">Seller Questions</span>
                </div>
                <div className="space-y-2">
                  {[
                    'What\'s driving your thinking about selling  -  is it timing, lifestyle, something else?',
                    'If you did sell, where would you go from here?',
                    'How did you land on that timeline?',
                    'What would need to happen for you to feel ready?',
                    'Have you done any updates or improvements to the home recently?',
                    'What\'s your biggest concern about the selling process?',
                    'Have you talked to any other agents, or is this the first conversation you\'ve had?',
                    'What\'s important about [specific thing they mentioned]?',
                  ].map((q, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-zinc-300 text-sm mt-0.5">→</span>
                      <p className="text-sm text-zinc-600 italic">&ldquo;{q}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Universal Follow-Ups</p>
              <div className="space-y-1">
                {[
                  '"That\'s interesting  -  tell me more about that."',
                  '"What\'s important about that to you?"',
                  '"How would that change things for you?"',
                  '"And then what?"',
                ].map((q, i) => (
                  <p key={i} className="text-sm text-zinc-600 italic">{q}</p>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="discovery" completed={completedIds.has('discovery')} nextHref="?tab=follow-up" />
            </div>
          </div>
        )}

        {/* Follow-Up */}
        {activeTab === 'follow-up' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="font-semibold mb-2">After the Call  -  Follow-Up Strategy</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Most deals are won in the follow-up, not the first call. Your job after the first conversation
                is to stay relevant, deliver value, and show up consistently until they are ready to act.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-sm font-semibold mb-3">Immediately After the Call</p>
                <div className="space-y-2">
                  {[
                    'Log detailed notes in FUB  -  what they said, their timeline, their concerns, their motivation.',
                    'Send the Seller Report or listing link you promised during the call.',
                    'Set a Next Action date in FUB (when to follow up).',
                    'Update their stage to match where they actually are.',
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-zinc-400 text-sm mt-0.5">•</span>
                      <p className="text-sm text-zinc-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-sm font-semibold mb-1">Watch Their Behavior</p>
                <p className="text-sm text-zinc-500 mb-3">Ylopo tracks everything. These are your follow-up triggers:</p>
                <div className="space-y-3">
                  {[
                    { trigger: 'Seller views report 2+ times in a week', action: 'Call immediately. They are thinking about it. Open with: "Hey, did the numbers surprise you at all?"' },
                    { trigger: 'Buyer favorites a home on your site', action: 'Text them: "I noticed you saved [address]  -  want to set up a showing?" Strike while the iron is hot.' },
                    { trigger: 'Lead re-engages on search site after being cold', action: 'This is a re-engagement signal. Call same day with the inactive lead script.' },
                    { trigger: 'Ylopo AI gets a reply', action: 'You have 5 minutes. Call before anyone else does.' },
                  ].map(item => (
                    <div key={item.trigger} className="border border-zinc-100 rounded-lg p-3">
                      <p className="text-xs font-semibold text-zinc-500 mb-1">{item.trigger}</p>
                      <p className="text-sm text-zinc-600">{item.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="follow-up" completed={completedIds.has('follow-up')} nextHref="?tab=mindset-check" />
            </div>
          </div>
        )}

        {/* Mindset Check */}
        {activeTab === 'mindset-check' && (
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="font-semibold mb-2">Before Every Call  -  Mindset Check</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Run through these before you pick up the phone. The mental state you bring to the call
                determines everything about how the conversation goes.
              </p>
            </div>
            {[
              { title: 'I am calling to help, not to sell.', body: 'My job is to be a resource. If they are not ready, I will give them something valuable and stay in touch. That is a win.' },
              { title: 'A "no" is not personal.', body: 'They do not know me. Their reaction is about their moment  -  their day, their stress, their timeline. It has nothing to do with my value as an agent.' },
              { title: 'Every call is a data point, not a verdict.', body: 'Even a hang-up tells me something. Stay curious, not defensive.' },
              { title: 'I am the guide. They are the hero.', body: 'This is their story  -  their home, their family, their finances. I am just here to make the path clearer.' },
              { title: 'The fortune is in the follow-up.', body: 'Most people who say no today will be ready in 3–12 months. My job is to still be here when that moment comes.' },
            ].map(item => (
              <div key={item.title} className="bg-white border border-zinc-200 rounded-xl p-5">
                <p className="text-sm font-semibold mb-1.5">{item.title}</p>
                <p className="text-sm text-zinc-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <SectionComplete moduleId={MODULE_ID} sectionId="mindset-check" completed={completedIds.has('mindset-check')} />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
