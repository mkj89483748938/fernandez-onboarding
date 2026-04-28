import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default async function ExpResourcesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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

        <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center">
          <p className="text-sm text-zinc-500">Resource links coming soon.</p>
        </div>

      </div>
    </div>
  )
}
