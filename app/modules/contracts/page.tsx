import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import SectionComplete from '@/components/SectionComplete'
import CopyButton from '@/components/CopyButton'

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
  const activeTab = params.tab ?? 'rpa'

  const tabs = [
    { id: 'rpa', label: 'RPA' },
    { id: 'listing', label: 'Listing Agreement' },
    { id: 'avid', label: 'AVID' },
    { id: 'rr', label: 'Request for Repair' },
    { id: 'counter', label: 'Counter Offer' },
    { id: 'escrow-checklist', label: 'Escrow Checklist' },
    { id: 'escrow-email', label: 'Escrow Email' },
  ]

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-1">Module 5</p>
          <h1 className="text-2xl font-semibold tracking-tight">Contract Basics</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Step-by-step walkthroughs for California CAR forms. Always review with your team lead before submitting.
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

        {/* RPA */}
        {activeTab === 'rpa' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="font-semibold mb-1">Residential Purchase Agreement (RPA)</h2>
              <p className="text-sm text-zinc-500">California Association of REALTORS® Form RPA</p>
              <p className="text-sm text-zinc-600 mt-3 leading-relaxed">
                The RPA is the primary contract used when a buyer makes an offer on a property in California.
                It outlines all terms of the transaction  -  price, contingencies, timelines, and conditions.
                Every field matters. Read each section carefully before completing.
              </p>
            </div>

            {[
              {
                section: 'Section 1  -  Offer & Purchase Price',
                fields: [
                  { field: 'Purchase Price', how: 'Enter the full dollar amount the buyer is offering. Write it in both numerals and words.' },
                  { field: 'Down Payment', how: 'Enter the buyer\'s down payment amount. This should match what the lender confirmed.' },
                  { field: 'Loan Amount', how: 'Purchase price minus down payment. Confirm with the lender before writing.' },
                ],
              },
              {
                section: 'Section 2  -  Finance Terms',
                fields: [
                  { field: 'Loan Type', how: 'Check Conventional, FHA, VA, or Other. Confirm with buyer\'s lender.' },
                  { field: 'Loan-to-Value Ratio', how: 'Loan amount divided by purchase price. Usually 80%, 90%, or 95%.' },
                  { field: 'Verification of Down Payment', how: 'Enter the number of days buyer has to provide proof of funds. Standard is 3 days.' },
                ],
              },
              {
                section: 'Section 3  -  Closing & Possession',
                fields: [
                  { field: 'Close of Escrow Date', how: 'Enter the target closing date. Standard is 21–30 days for conventional, 30–45 for FHA/VA. Confirm with lender.' },
                  { field: 'Possession', how: 'Typically "at close of escrow." If seller needs rent-back, negotiate separately.' },
                ],
              },
              {
                section: 'Section 4  -  Contingencies',
                fields: [
                  { field: 'Loan Contingency', how: 'Standard 21 days. Do not waive without discussing with the team lead and your buyer.' },
                  { field: 'Appraisal Contingency', how: 'Standard 17 days. Protects buyer if home appraises below purchase price.' },
                  { field: 'Inspection Contingency', how: 'Standard 17 days. Gives buyer the right to inspect and negotiate repairs or cancel.' },
                ],
              },
              {
                section: 'Section 5  -  Included Items & Personal Property',
                fields: [
                  { field: 'Items Included', how: 'Check all built-in appliances that convey with the property (dishwasher, range, etc.). Stoves and refrigerators should be called out explicitly if included.' },
                  { field: 'Personal Property', how: 'Any non-fixture items the seller is including. List them specifically.' },
                ],
              },
              {
                section: 'Signatures & Dates',
                fields: [
                  { field: 'Buyer Signature + Date', how: 'All buyers must sign and date. Electronic signatures via DocuSign are acceptable.' },
                  { field: 'Offer Expiration', how: 'Enter the date and time the offer expires. Give seller enough time to respond  -  typically 24–48 hours.' },
                ],
              },
            ].map(sec => (
              <div key={sec.section} className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                <div className="bg-zinc-100 px-5 py-3">
                  <p className="text-sm font-semibold">{sec.section}</p>
                </div>
                <div className="p-4 space-y-3">
                  {sec.fields.map(f => (
                    <div key={f.field} className="flex gap-3">
                      <div className="w-1 bg-zinc-200 rounded-full shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">{f.field}</p>
                        <p className="text-sm text-zinc-600 mt-0.5">{f.how}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">Important</p>
              <p className="text-sm text-amber-800">
                Never submit an RPA without having your team lead or a transaction coordinator review it first.
                One mistake in the contingency section can cost your client thousands of dollars or their deposit.
              </p>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="rpa" completed={completedIds.has('rpa')} nextHref="?tab=listing" />
            </div>
          </div>
        )}

        {/* Listing Agreement */}
        {activeTab === 'listing' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="font-semibold mb-1">Listing Agreement</h2>
              <p className="text-sm text-zinc-500">California Association of REALTORS® Form RLA (Residential Listing Agreement)</p>
              <p className="text-sm text-zinc-600 mt-3 leading-relaxed">
                The listing agreement is your contract with the seller. It authorizes you to market their property,
                establishes your commission, and defines the terms of your engagement.
                The seller signs this at the listing appointment.
              </p>
            </div>

            {[
              {
                section: 'Property Information',
                fields: [
                  { field: 'Property Address', how: 'Full legal address including unit number if applicable.' },
                  { field: 'APN (Assessor\'s Parcel Number)', how: 'Find this on the property tax bill or county assessor website. Required for the MLS.' },
                ],
              },
              {
                section: 'Listing Terms',
                fields: [
                  { field: 'Listing Price', how: 'The price you and the seller agree to list at. Based on your CMA. Do not fill this in until you have completed your pricing analysis.' },
                  { field: 'Listing Period', how: 'The duration of the agreement. Standard is 90–180 days. Discuss with your team lead before shortening.' },
                  { field: 'Listing Type', how: 'Exclusive Right to Sell is standard. This means you earn the commission regardless of who brings the buyer.' },
                ],
              },
              {
                section: 'Commission',
                fields: [
                  { field: 'Total Commission %', how: 'Discuss with your team lead  -  commission structure varies. Do not quote a rate until you have confirmed with the team.' },
                  { field: 'Buyer\'s Agent Compensation', how: 'Since the NAR settlement (August 2024), buyer agent compensation is no longer listed on MLS. Discuss with team lead how to handle this.' },
                ],
              },
              {
                section: 'Seller Disclosures & Obligations',
                fields: [
                  { field: 'Seller Disclosures', how: 'The seller is required to complete the Transfer Disclosure Statement (TDS) and Seller Property Questionnaire (SPQ). Order these immediately after signing.' },
                  { field: 'Seller Possession', how: 'Confirm when the seller plans to vacate. This affects closing date negotiations.' },
                ],
              },
              {
                section: 'MLS & Marketing Authorization',
                fields: [
                  { field: 'MLS Authorization', how: 'Seller authorizes you to submit their property to the MLS. This is standard. Note any exclusions (e.g., no photos yet).' },
                  { field: 'Lockbox Authorization', how: 'Seller signs off on placing a Supra lockbox. Confirm they understand access procedures.' },
                ],
              },
            ].map(sec => (
              <div key={sec.section} className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                <div className="bg-zinc-100 px-5 py-3">
                  <p className="text-sm font-semibold">{sec.section}</p>
                </div>
                <div className="p-4 space-y-3">
                  {sec.fields.map(f => (
                    <div key={f.field} className="flex gap-3">
                      <div className="w-1 bg-zinc-200 rounded-full shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">{f.field}</p>
                        <p className="text-sm text-zinc-600 mt-0.5">{f.how}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="listing" completed={completedIds.has('listing')} nextHref="?tab=avid" />
            </div>
          </div>
        )}

        {/* AVID */}
        {activeTab === 'avid' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="font-semibold mb-1">Agent Visual Inspection Disclosure (AVID)</h2>
              <p className="text-sm text-zinc-500">California Association of REALTORS® Form AVID</p>
              <p className="text-sm text-zinc-600 mt-3 leading-relaxed">
                The AVID documents what you  -  the agent  -  visually observed during your inspection of the property.
                This is not the same as a home inspection report. It is your personal disclosure of visible conditions.
                It protects you legally and informs the buyer.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">Legal Note</p>
              <p className="text-sm text-amber-800">
                You are required by California law to conduct a reasonably competent visual inspection of the property
                and disclose material facts. Failure to disclose is one of the top causes of agent liability.
                When in doubt, disclose it.
              </p>
            </div>

            {[
              {
                section: 'Property & Agent Information',
                fields: [
                  { field: 'Property Address', how: 'Full property address.' },
                  { field: 'Your Name & License Number', how: 'Your full name as it appears on your DRE license.' },
                  { field: 'Date of Inspection', how: 'The date you physically walked the property.' },
                  { field: 'Representing', how: 'Check Buyer or Seller/Listing Agent depending on your role.' },
                ],
              },
              {
                section: 'Areas Inspected',
                fields: [
                  { field: 'Accessible Areas', how: 'Check all areas you were able to access and inspect. If you could not access an area (e.g., crawl space was locked), note that explicitly.' },
                  { field: 'Areas Not Inspected', how: 'List any areas you did not inspect and why. This is important for limiting your liability.' },
                ],
              },
              {
                section: 'Items & Conditions Observed',
                fields: [
                  { field: 'Roof', how: 'Note visible condition  -  missing shingles, sagging, water stains on ceiling that indicate a roof issue.' },
                  { field: 'Foundation / Structure', how: 'Note visible cracks, settlement, uneven floors. Do not speculate  -  describe only what you see.' },
                  { field: 'Plumbing', how: 'Note visible leaks under sinks, water stains, corrosion, or low water pressure you observed.' },
                  { field: 'Electrical', how: 'Note visible issues  -  exposed wiring, non-functioning outlets, outdated panel.' },
                  { field: 'HVAC', how: 'Note age if visible, whether units appeared to function, any unusual sounds.' },
                  { field: 'Water Intrusion / Mold', how: 'Any visible staining, discoloration, or odor suggesting moisture. Disclose everything you see.' },
                  { field: 'Additional Items', how: 'Anything else you observed that a buyer would want to know. Better to over-disclose than under-disclose.' },
                ],
              },
            ].map(sec => (
              <div key={sec.section} className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                <div className="bg-zinc-100 px-5 py-3">
                  <p className="text-sm font-semibold">{sec.section}</p>
                </div>
                <div className="p-4 space-y-3">
                  {sec.fields.map(f => (
                    <div key={f.field} className="flex gap-3">
                      <div className="w-1 bg-zinc-200 rounded-full shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">{f.field}</p>
                        <p className="text-sm text-zinc-600 mt-0.5">{f.how}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="avid" completed={completedIds.has('avid')} nextHref="?tab=rr" />
            </div>
          </div>
        )}

        {/* Request for Repair */}
        {activeTab === 'rr' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="font-semibold mb-1">Request for Repair (RR)</h2>
              <p className="text-sm text-zinc-500">California Association of REALTORS® Form RR</p>
              <p className="text-sm text-zinc-600 mt-3 leading-relaxed">
                The Request for Repair is used by the buyer (during the inspection contingency period) to request
                that the seller make repairs, provide credits, or lower the price based on issues found during
                the home inspection. This is a negotiation document  -  word it carefully.
              </p>
            </div>

            {[
              {
                section: 'Property & Transaction Info',
                fields: [
                  { field: 'Property Address', how: 'Full property address.' },
                  { field: 'Escrow Number', how: 'Obtain from the escrow officer. Required to identify the transaction.' },
                ],
              },
              {
                section: 'Request Options  -  Choose One',
                fields: [
                  { field: 'Option 1: Repairs', how: 'The seller agrees to complete specific repairs before close of escrow. List each item clearly. Be specific: "Replace water heater in garage" not "fix plumbing."' },
                  { field: 'Option 2: Credit in Lieu of Repairs', how: 'Request a credit to the buyer\'s closing costs instead of repairs. Seller credits can be used to buy down the rate or cover closing costs. Confirm the credit amount with your lender (loan type limits apply).' },
                  { field: 'Option 3: Price Reduction', how: 'Request a reduction in the purchase price. Less common because it reduces the buyer\'s loan amount. Used mostly in cash transactions.' },
                ],
              },
              {
                section: 'Itemized Repair Requests',
                fields: [
                  { field: 'List Each Item Separately', how: 'Do not bundle all repairs into one line. List each item on its own so the seller can accept some and reject others.' },
                  { field: 'Reference the Inspection Report', how: 'State the section of the inspection report each request comes from. "Per inspection report, Section 3.2  -  HVAC unit showed inadequate airflow."' },
                  { field: 'Use Dollar Amounts Where Possible', how: 'If you have repair bids, include them. It makes your request more credible and harder to reject.' },
                ],
              },
              {
                section: 'Response Deadline',
                fields: [
                  { field: 'Seller Response Date', how: 'Set a date by which the seller must respond. Standard is 3–5 days. Do not make it too short or it creates unnecessary pressure.' },
                ],
              },
            ].map(sec => (
              <div key={sec.section} className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                <div className="bg-zinc-100 px-5 py-3">
                  <p className="text-sm font-semibold">{sec.section}</p>
                </div>
                <div className="p-4 space-y-3">
                  {sec.fields.map(f => (
                    <div key={f.field} className="flex gap-3">
                      <div className="w-1 bg-zinc-200 rounded-full shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">{f.field}</p>
                        <p className="text-sm text-zinc-600 mt-0.5">{f.how}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Strategy Note</p>
              <p className="text-sm text-zinc-600">
                Do not ask for everything in the inspection report. Prioritize health and safety items, major systems
                (roof, HVAC, foundation), and anything that was not disclosed. Cosmetic items are rarely worth
                negotiating and can kill a deal over minor issues.
              </p>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="rr" completed={completedIds.has('rr')} nextHref="?tab=counter" />
            </div>
          </div>
        )}

        {/* Counter Offer */}
        {activeTab === 'counter' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="font-semibold mb-1">Counter Offer</h2>
              <p className="text-sm text-zinc-500">California Association of REALTORS® Form CO (Counter Offer)</p>
              <p className="text-sm text-zinc-600 mt-3 leading-relaxed">
                The Counter Offer modifies one or more terms of the original RPA (or a previous counter).
                Both parties can counter. The final accepted counter, combined with the original RPA, forms
                the binding contract.
              </p>
            </div>

            {[
              {
                section: 'Header Information',
                fields: [
                  { field: 'Date', how: 'Date the counter offer is being issued.' },
                  { field: 'Property Address', how: 'Full property address.' },
                  { field: 'This Counter Offer is Made By', how: 'Check Seller or Buyer depending on who is issuing the counter.' },
                  { field: 'In Response To', how: 'Reference the date of the original offer or prior counter that this counter is responding to.' },
                ],
              },
              {
                section: 'Terms Being Modified',
                fields: [
                  { field: 'Modified Terms', how: 'List ONLY the terms that are changing. All other terms from the original offer remain in effect. Common modifications: purchase price, close of escrow date, included items, contingency periods.' },
                  { field: 'Purchase Price (if changing)', how: 'Write the new price in full, both numerals and words.' },
                  { field: 'Close of Escrow (if changing)', how: 'New target closing date. Confirm with escrow and lender before committing.' },
                  { field: 'Repair Credits / Concessions (if applicable)', how: 'If counter includes a credit to the buyer, specify the exact dollar amount and whether it is a closing cost credit or price reduction.' },
                ],
              },
              {
                section: 'Acceptance & Expiration',
                fields: [
                  { field: 'Acceptance Deadline', how: 'Date and time the counter expires. Give the other party reasonable time  -  24–48 hours is standard. Do not create artificial urgency that damages the negotiation.' },
                  { field: 'Signature of Issuing Party', how: 'All sellers (or all buyers) must sign. No unsigned counters.' },
                  { field: 'Acceptance Signature', how: 'When the other party accepts, they sign and date the acceptance line. Both parties receive a fully signed copy.' },
                ],
              },
            ].map(sec => (
              <div key={sec.section} className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                <div className="bg-zinc-100 px-5 py-3">
                  <p className="text-sm font-semibold">{sec.section}</p>
                </div>
                <div className="p-4 space-y-3">
                  {sec.fields.map(f => (
                    <div key={f.field} className="flex gap-3">
                      <div className="w-1 bg-zinc-200 rounded-full shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">{f.field}</p>
                        <p className="text-sm text-zinc-600 mt-0.5">{f.how}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="counter" completed={completedIds.has('counter')} nextHref="?tab=escrow-checklist" />
            </div>
          </div>
        )}

        {/* Escrow Checklist */}
        {activeTab === 'escrow-checklist' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="font-semibold mb-2">In-Escrow Checklist</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Once a contract is fully executed (both parties have signed), you open escrow.
                Use this checklist to make sure nothing falls through the cracks between acceptance and close.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { phase: 'Day 1  -  Open Escrow', items: [
                  'Send fully executed contract to escrow company',
                  'Send opening escrow email to all parties (template in next tab)',
                  'Update lead stage to "Pending" in FUB',
                  'Order Natural Hazard Disclosure (NHD) report',
                  'Confirm buyer\'s lender has the contract and appraisal is ordered',
                ]},
                { phase: 'Days 1–3  -  Buyer Duties', items: [
                  'Buyer signs escrow instructions',
                  'Buyer submits earnest money deposit (EMD) per contract terms',
                  'Buyer provides proof of funds / verification of down payment',
                  'Schedule home inspection (within inspection contingency period)',
                ]},
                { phase: 'Days 3–17  -  Inspection Period', items: [
                  'Home inspection completed',
                  'Review inspection report with buyer / seller',
                  'Submit Request for Repair if applicable',
                  'AVID completed and submitted',
                  'Seller completes TDS and SPQ if not already done',
                  'Review all seller disclosures with buyer; buyer signs receipt',
                ]},
                { phase: 'Days 14–21  -  Appraisal & Loan', items: [
                  'Appraisal ordered and scheduled',
                  'Appraisal report received  -  confirm value meets or exceeds purchase price',
                  'Lender provides loan approval / clear to close',
                  'Remove loan contingency (with buyer\'s written authorization)',
                  'Remove appraisal contingency (with buyer\'s written authorization)',
                ]},
                { phase: 'Days 17–25  -  Final Steps', items: [
                  'Confirm final loan documents are at title',
                  'Schedule buyer signing with title/notary',
                  'Schedule final walkthrough with buyer (1–2 days before close)',
                  'Confirm all repairs completed (if any were agreed upon)',
                ]},
                { phase: 'Close of Escrow Day', items: [
                  'Confirm funds have been wired / received by escrow',
                  'Confirm deed has been recorded',
                  'Obtain keys from escrow or seller agent',
                  'Deliver keys to buyer',
                  'Update stage to "Closed" in FUB',
                  'Send congratulations to your client',
                  'Request a Google review and referral',
                ]},
              ].map(phase => (
                <div key={phase.phase} className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                  <div className="bg-zinc-100 px-5 py-3">
                    <p className="text-sm font-semibold">{phase.phase}</p>
                  </div>
                  <div className="p-4 space-y-2">
                    {phase.items.map((item, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="w-4 h-4 rounded border border-zinc-300 mt-0.5 shrink-0"></div>
                        <p className="text-sm text-zinc-600">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="escrow-checklist" completed={completedIds.has('escrow-checklist')} nextHref="?tab=escrow-email" />
            </div>
          </div>
        )}

        {/* Escrow Email */}
        {activeTab === 'escrow-email' && (
          <div className="space-y-5">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h2 className="font-semibold mb-2">Opening Escrow Email Template</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Send this email within 24 hours of opening escrow. It sets expectations, introduces all parties,
                and creates a paper trail. CC your transaction coordinator if you have one.
              </p>
            </div>

            <EscrowEmailTemplate />

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Who to CC</p>
              <ul className="space-y-1 text-sm text-zinc-600">
                <li>• Escrow officer</li>
                <li>• Buyer&apos;s lender</li>
                <li>• Other agent (buyer&apos;s or listing agent)</li>
                <li>• Transaction coordinator (if applicable)</li>
                <li>• Your team lead</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <SectionComplete moduleId={MODULE_ID} sectionId="escrow-email" completed={completedIds.has('escrow-email')} />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function EscrowEmailTemplate() {
  const template = `Subject: Escrow Opening – [Property Address] | [Buyer Name] / [Seller Name]

Hi everyone,

I am writing to introduce the parties for the above transaction and confirm that escrow has been opened.

PROPERTY: [Full Property Address]
ESCROW #: [Escrow Number  -  obtain from escrow officer]
PROJECTED CLOSE: [Close of Escrow Date]

PARTIES:
• Buyer: [Buyer Full Name] | [Buyer Email] | [Buyer Phone]
• Seller: [Seller Full Name] | [Seller Email] | [Seller Phone]
• Listing Agent: [Name] | [Brokerage] | [Email] | [Phone]
• Buyer's Agent: [Your Name] | The Fernandez Group at eXp Realty | [Your Email] | [Your Phone]
• Escrow Officer: [Name] | [Company] | [Email] | [Phone]
• Lender: [Loan Officer Name] | [Company] | [Email] | [Phone]

KEY DATES (per contract):
• Earnest Money Deposit Due: [Date]
• Inspection Contingency Deadline: [Date]
• Appraisal Contingency Deadline: [Date]
• Loan Contingency Deadline: [Date]
• Close of Escrow: [Date]

Please do not hesitate to reach out with any questions. I look forward to a smooth transaction.

Best regards,
[Your Name]
[Your Phone]
The Fernandez Group at eXp Realty
DRE #[Your License Number]`

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 bg-zinc-50">
        <p className="text-sm font-medium">Email Template</p>
        <CopyButton text={template} />
      </div>
      <pre className="p-5 text-sm text-zinc-600 whitespace-pre-wrap leading-relaxed font-sans">
        {template}
      </pre>
    </div>
  )
}

