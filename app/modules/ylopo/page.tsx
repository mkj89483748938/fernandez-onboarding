import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import SectionComplete from '@/components/SectionComplete'

const MODULE_ID = 'ylopo'

export default async function YlopoPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
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
  const activeTab = params.tab ?? 'overview'

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'stars', label: 'Ylopo Stars' },
    { id: 'listing-alerts', label: 'Listing Alerts' },
    { id: 'seller-reports', label: 'Seller Reports' },
    { id: 'ai-conversations', label: 'AI Conversations' },
    { id: 'agent-site', label: 'Your Agent Site' },
  ]

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-1">Module 3</p>
          <h1 className="text-2xl font-semibold tracking-tight">Ylopo</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Ylopo is our lead generation and AI nurture platform. Learn how to use every tool it gives you.
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

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3">
              <h2 className="font-semibold">What is Ylopo?</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Ylopo is a suite of tools designed to assist your lead nurture and help you convert more leads.
                It combines AI-powered outreach, dynamic ad campaigns, buyer and seller search sites, and
                behavioral analytics — all connected to your Follow Up Boss CRM.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                When a lead registers on your site, Ylopo&apos;s AI (Raiya) begins automated text and email
                outreach immediately. Your job is to jump in the moment a lead replies. Ylopo handles the
                first contact; you handle the conversion.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Think of Ylopo as your 24/7 assistant — it never stops working your database, keeping leads
                warm and surfacing the ones who are ready to act. The agents who win with Ylopo are the ones
                who respond fast when it flags an engaged lead.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'AI Nurture', desc: 'Raiya AI texts and emails leads automatically until they respond.' },
                { label: 'Buyer Search Site', desc: 'Branded IDX property search for buyers.' },
                { label: 'Seller Reports', desc: 'Automated home value reports that track seller engagement.' },
                { label: 'Ylopo Stars', desc: 'Lead scoring that ranks your leads by engagement level.' },
                { label: 'Listing Alerts', desc: 'Auto-emails matching new listings to buyers on your criteria.' },
                { label: 'Dynamic Ads', desc: 'Facebook and Google retargeting ads run automatically.' },
              ].map(f => (
                <div key={f.label} className="bg-white border border-zinc-200 rounded-xl p-4">
                  <p className="text-sm font-semibold mb-1">{f.label}</p>
                  <p className="text-xs text-zinc-500">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="overview" completed={completedIds.has('overview')} nextHref="?tab=stars" />
            </div>
          </div>
        )}

        {/* Ylopo Stars */}
        {activeTab === 'stars' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3">
              <h2 className="font-semibold">What is Ylopo Stars?</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Ylopo Stars is the command center for your leads. It syncs your Follow Up Boss account and your website,
                allowing you to send listings, generate home equity reports, get AI to engage stale leads, and remarket
                to your database. Make sure all of your leads are in Stars and have a Stars link — found under Custom
                Fields in Follow Up Boss.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h3 className="font-semibold mb-4">How to Add a Lead to Ylopo Stars</h3>
              <ol className="space-y-4">
                {[
                  { text: 'Log in to your Ylopo dashboard at stars.ylopo.com.', link: { label: 'stars.ylopo.com', href: 'https://stars.ylopo.com' } },
                  { text: 'Upon login you will see an Add Lead button in green on the top left.' },
                  { text: 'Click Add, then select Pull Details from Follow Up Boss.' },
                  { text: "Paste the lead's URL from Follow Up Boss — go to the lead's profile, copy the website address, and paste it into the box." },
                  { text: 'Click Pull Details.' },
                  { text: 'You can create a search by checking the box, or do this later.' },
                  { text: 'Click Submit and Save.' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-semibold shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-zinc-600 leading-relaxed">{step.text}</p>
                  </div>
                ))}
              </ol>
              <p className="text-sm text-zinc-500 mt-5 leading-relaxed">
                You are now in the lead&apos;s Stars profile. To return anytime, click the Stars link at the bottom left of the lead&apos;s record in FUB under Custom Fields.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Video Walkthrough</p>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src="https://www.loom.com/embed/21d3f992c59a47fdae4117c505d6b981"
                  className="absolute inset-0 w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Pro Tip</p>
              <p className="text-sm text-zinc-600">
                Check your Smart Lists in Follow Up Boss daily — they will identify your most engaged leads right now.
              </p>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="stars" completed={completedIds.has('stars')} nextHref="?tab=listing-alerts" />
            </div>
          </div>
        )}

        {/* Listing Alerts */}
        {activeTab === 'listing-alerts' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3">
              <h2 className="font-semibold">Listing Alerts & Sending Listing Links</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Listing alerts automatically email your buyer leads when a new property matches their search
                criteria. They keep your leads engaged and bring them back to your site without you having
                to manually send properties every day.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h3 className="font-semibold mb-4">How to Set Up a Listing Alert for a Buyer</h3>
              <ol className="space-y-4">
                {[
                  'Open the lead\'s profile in your Ylopo dashboard.',
                  'Click on the Search Criteria tab in their profile.',
                  'Click "Add Search" to create a new saved search.',
                  'Enter the search parameters: city, zip code, price range, bedrooms, bathrooms, and property type.',
                  'Toggle the "Email Alerts" switch to ON so the lead receives emails when matching homes hit the market.',
                  'Set the alert frequency — "Instant" for hot buyers, "Daily" for warm/cold.',
                  'Click Save. The lead will now receive automated listing emails that link back to your buyer site.',
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-semibold shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-zinc-600 leading-relaxed">{step}</p>
                  </div>
                ))}
              </ol>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h3 className="font-semibold mb-4">How to Send a Listing Link Directly to a Client</h3>
              <ol className="space-y-4">
                {[
                  'Find the property on your buyer IDX site (e.g., matt.buyinginoc.com).',
                  'Navigate to the property listing page.',
                  'Copy the URL from your browser — this is a tracked link that connects the view back to the lead in your database.',
                  'Text or email this link directly to your client. When they click it, their activity is logged in Ylopo and FUB.',
                  'In FUB, log that you sent them a property and note what they liked about it.',
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-semibold shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-zinc-600 leading-relaxed">{step}</p>
                  </div>
                ))}
              </ol>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold">Listing Alert Links — Share a Direct Search Link</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                There is a new feature in Ylopo Stars listing alerts. Under <strong>Saved Search &amp; Listing Alerts</strong>,
                when you select Listing Alerts, you will see a new link button. Once a listing alert is created,
                you can generate a link to share directly with the lead.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                This link routes directly to your home search site using the criteria from the listing alert
                while automatically logging the lead in. As the lead changes their search parameters, Ylopo
                dynamically updates the listing alert to reflect their engagement.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-700 mb-1">Important</p>
                <p className="text-sm text-red-700">
                  Do <strong>not</strong> click on this link yourself — it will register as lead engagement
                  and skew their behavioral data in Ylopo.
                </p>
              </div>
              <div className="pt-1">
                <a
                  href="https://www.loom.com/share/7149c8aa55434ad2bca1f1e99bf66d2a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 underline underline-offset-2"
                >
                  Watch the walkthrough video by Gabe Cordova →
                </a>
              </div>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="listing-alerts" completed={completedIds.has('listing-alerts')} nextHref="?tab=seller-reports" />
            </div>
          </div>
        )}

        {/* Seller Reports */}
        {activeTab === 'seller-reports' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3">
              <h2 className="font-semibold">The Seller Report</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                The Seller Report is a branded, automated home valuation report sent to potential sellers.
                It shows their estimated home value, equity position, and how many buyers are actively searching
                for a home like theirs. It is one of your most powerful long-term nurture tools.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h3 className="font-semibold mb-4">How to Put a Lead on a Seller Report</h3>
              <ol className="space-y-4">
                {[
                  'Open the lead\'s profile in your Ylopo dashboard.',
                  'Click the "Seller" tab or scroll to the Seller section.',
                  'Click "Add Property" and enter the lead\'s home address.',
                  'Ylopo will pull the property data and generate an estimated value.',
                  'Toggle the "Send Seller Report" switch to ON.',
                  'Set the delivery frequency — Monthly is the standard for long-term nurture.',
                  'Click Save. The lead will begin receiving automated monthly reports with their home\'s estimated value.',
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-semibold shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-zinc-600 leading-relaxed">{step}</p>
                  </div>
                ))}
              </ol>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h3 className="font-semibold mb-3">How to Read the Seller Report</h3>
              <div className="space-y-3">
                {[
                  { label: 'Estimated Value', desc: 'The AVM (Automated Valuation Model) for their home. Not the same as a CMA, but a useful starting point for the conversation.' },
                  { label: 'Equity Estimate', desc: 'Estimated home equity based on purchase price and current valuation. This number makes sellers act — show it prominently when you follow up.' },
                  { label: 'Active Buyers', desc: 'How many buyers are currently searching for a home matching theirs. High buyer demand = a great opening for a listing conversation.' },
                  { label: 'Market Trends', desc: 'Local price trends and days-on-market data for their area.' },
                  { label: 'View Count', desc: 'How many times this seller has viewed their own report. Multiple views = high intent. That is your follow-up trigger.' },
                ].map(item => (
                  <div key={item.label} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 mt-2 shrink-0"></div>
                    <div>
                      <span className="text-sm font-medium">{item.label}: </span>
                      <span className="text-sm text-zinc-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 text-white rounded-xl p-5">
              <p className="text-sm font-semibold mb-1">Follow-Up Trigger</p>
              <p className="text-sm text-zinc-300">
                When a seller views their report 2+ times in a week, call them immediately.
                Open with: <em>&ldquo;Hey [Name], I saw you were checking out your home value — did the numbers surprise you at all?&rdquo;</em>
              </p>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="seller-reports" completed={completedIds.has('seller-reports')} nextHref="?tab=ai-conversations" />
            </div>
          </div>
        )}

        {/* AI Conversations */}
        {activeTab === 'ai-conversations' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3">
              <h2 className="font-semibold">Taking Over AI Conversations</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Ylopo&apos;s AI (Raiya) handles the first wave of outreach via text message. When a lead responds,
                the AI continues the conversation until the lead asks to speak with a human — or until you
                take over manually. Knowing when and how to take over is critical.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h3 className="font-semibold mb-4">When to Take Over</h3>
              <div className="space-y-3">
                {[
                  'The lead asks a question the AI cannot answer (pricing specifics, showing availability, area recommendations).',
                  'The lead replies with emotional language — frustration, excitement, urgency. A human needs to respond.',
                  'The lead says "can I talk to someone" or "call me" — take over immediately.',
                  'The lead has replied 2+ times. This is an engaged lead. Jump in.',
                  'You receive an AI Replies smart list alert in FUB. That is your signal.',
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 mt-2 shrink-0"></div>
                    <p className="text-sm text-zinc-600 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h3 className="font-semibold mb-4">How to Take Over an AI Conversation</h3>
              <ol className="space-y-4">
                {[
                  'Open the lead in Follow Up Boss — not Ylopo. The conversation thread syncs to FUB.',
                  'Read the full AI conversation from the beginning so you have context.',
                  'Click "Pause AI" or toggle off AI outreach for this lead in FUB or Ylopo.',
                  'Call the lead first. Do not text back through the AI thread — break the pattern and call.',
                  'If they do not answer, send a personal text from your number: "Hi [Name], this is [Your Name] — I saw your message. Do you have 5 minutes to chat today?"',
                  'Log your call attempt in FUB immediately.',
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-semibold shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-zinc-600 leading-relaxed">{step}</p>
                  </div>
                ))}
              </ol>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">Important</p>
              <p className="text-sm text-amber-800">
                Never let the AI continue talking to a lead you have already spoken to by phone.
                Pause AI the moment you make personal contact. Nothing kills momentum faster than
                a lead getting an AI text right after a real conversation with you.
              </p>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="ai-conversations" completed={completedIds.has('ai-conversations')} nextHref="?tab=agent-site" />
            </div>
          </div>
        )}

        {/* Agent Site */}
        {activeTab === 'agent-site' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3">
              <h2 className="font-semibold">Your Agent Subdomain</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                You have two dedicated URLs that brand the team&apos;s Ylopo sites to you personally.
                These are the links you share with leads, post on social media, and use in your marketing.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-zinc-900 text-white rounded-xl p-6">
                <p className="text-xs tracking-[0.15em] uppercase text-zinc-400 mb-2">Buyer Site</p>
                <p className="text-xl font-semibold font-mono">[yourname].buyinginoc.com</p>
                <p className="text-sm text-zinc-300 mt-2">
                  This is a full IDX property search site for buyers. Every lead who registers here
                  is connected to you in FUB and Ylopo. Share this when someone mentions buying.
                </p>
              </div>
              <div className="bg-white border-2 border-zinc-900 rounded-xl p-6">
                <p className="text-xs tracking-[0.15em] uppercase text-zinc-500 mb-2">Seller Site</p>
                <p className="text-xl font-semibold font-mono">[yourname].buyinginoc.com/seller</p>
                <p className="text-sm text-zinc-600 mt-2">
                  This is a home valuation landing page for sellers. When someone enters their address,
                  they get an instant estimate and become a lead on your Seller Report nurture sequence.
                  Share this with anyone who might be thinking about selling.
                </p>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h3 className="font-semibold mb-3">How to Use These Links</h3>
              <div className="space-y-3">
                {[
                  { scenario: 'Social media bio', action: 'Put your buyer site in your Instagram, Facebook, and LinkedIn bio.' },
                  { scenario: 'New buyer lead calls in', action: 'Text them your buyer site link immediately after the call: "Here\'s my search site — set up your search and you\'ll get alerts for new listings."' },
                  { scenario: 'Potential seller in your database', action: 'Text them the seller site: "I have a tool that shows your home\'s current value in 30 seconds — [yourname].buyinginoc.com/seller"' },
                  { scenario: 'Door knocking or open house', action: 'Have your seller site URL on your business card. It is a natural, low-pressure way to capture seller leads.' },
                  { scenario: 'Email signature', action: 'Add both links to your email signature with clear labels.' },
                ].map(item => (
                  <div key={item.scenario} className="border border-zinc-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-zinc-500 mb-1">{item.scenario}</p>
                    <p className="text-sm text-zinc-700">{item.action}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Note</p>
              <p className="text-sm text-zinc-600">
                Your exact subdomain will be set up by the team when you are onboarded to Ylopo.
                Ask the team lead for your specific URL after your account is created.
              </p>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="agent-site" completed={completedIds.has('agent-site')} />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
