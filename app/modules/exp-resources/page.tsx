import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import SectionComplete from '@/components/SectionComplete'
import { ExternalLink } from 'lucide-react'

const MODULE_ID = 'exp-resources'

export default async function ExpResourcesPage() {
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

  const resources = [
    {
      category: 'Training',
      links: [
        {
          label: 'Glide Training Videos',
          desc: 'On-demand webinar training for using Glide to draft and manage contracts.',
          href: 'https://help.glide.com/en/articles/4950522-glide-webinar-training-videos',
        },
        {
          label: 'eXp University - CA Training Library',
          desc: 'All eXp University training sessions for California agents, including the weekly Wednesday contracts course.',
          href: 'https://www.expuniversity.com/ca-training-library',
        },
      ],
    },
    {
      category: 'eXp Tools',
      links: [
        {
          label: 'eXp Agent Toolkit',
          desc: 'Your hub for eXp marketing materials, branding assets, and agent resources.',
          href: 'https://landing.exprealty.com/toolkits',
        },
      ],
    },
    {
      category: 'Team Resources',
      links: [
        {
          label: 'Office Linktree',
          desc: 'Quick access to all office links and team resources in one place.',
          href: 'https://linktr.ee/expofficeresources',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-1">Module 6</p>
          <h1 className="text-2xl font-semibold tracking-tight">eXp Resources</h1>
          <p className="text-zinc-500 text-sm mt-1">
            All team and eXp platform links in one place.
          </p>
        </div>

        <div className="space-y-6">
          {resources.map(group => (
            <div key={group.category}>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">{group.category}</p>
              <div className="space-y-3">
                {group.links.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start justify-between gap-4 bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-400 transition-all group"
                  >
                    <div>
                      <p className="text-sm font-semibold group-hover:text-[#2A7DB5] transition-colors">{link.label}</p>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{link.desc}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-[#2A7DB5] shrink-0 mt-0.5 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <SectionComplete moduleId={MODULE_ID} sectionId="resources" completed={completedIds.has('resources')} />
        </div>

      </div>
    </div>
  )
}
