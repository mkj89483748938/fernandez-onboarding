import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { MODULES } from '@/lib/modules'
import { getModuleProgress } from '@/lib/utils'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch all profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch all progress records
  const { data: allProgress } = await supabase
    .from('module_progress')
    .select('user_id, module_id, section_id, completed')
    .eq('completed', true)

  // Group progress by user
  const progressByUser: Record<string, Record<string, number>> = {}
  for (const row of (allProgress ?? [])) {
    if (!progressByUser[row.user_id]) progressByUser[row.user_id] = {}
    progressByUser[row.user_id][row.module_id] = (progressByUser[row.user_id][row.module_id] ?? 0) + 1
  }

  const totalSections = MODULES.reduce((sum, m) => sum + m.totalSections, 0)

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar isAdmin />
      <div className="max-w-6xl mx-auto px-4 py-12">

        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-1">Admin</p>
          <h1 className="text-2xl font-semibold tracking-tight">Agent Progress</h1>
          <p className="text-zinc-500 text-sm mt-1">{profiles?.length ?? 0} agents registered</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-400 mb-1">Total Agents</p>
            <p className="text-3xl font-semibold">{profiles?.length ?? 0}</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-400 mb-1">Fully Onboarded</p>
            <p className="text-3xl font-semibold">
              {profiles?.filter(p => {
                const completed = Object.values(progressByUser[p.id] ?? {}).reduce((a, b) => a + b, 0)
                return completed >= totalSections
              }).length ?? 0}
            </p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-400 mb-1">Profiles Submitted</p>
            <p className="text-3xl font-semibold">
              {profiles?.filter(p => p.license_number).length ?? 0}
            </p>
          </div>
        </div>

        {/* Agent Table */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="text-left text-xs font-medium uppercase tracking-wider text-zinc-400 px-5 py-3">Agent</th>
                  <th className="text-left text-xs font-medium uppercase tracking-wider text-zinc-400 px-5 py-3">License #</th>
                  <th className="text-left text-xs font-medium uppercase tracking-wider text-zinc-400 px-5 py-3">Overall</th>
                  {MODULES.map(m => (
                    <th key={m.id} className="text-left text-xs font-medium uppercase tracking-wider text-zinc-400 px-3 py-3">
                      {m.number}. {m.title.split(' ')[0]}
                    </th>
                  ))}
                  <th className="text-left text-xs font-medium uppercase tracking-wider text-zinc-400 px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {(profiles ?? []).map(agent => {
                  const agentProgress = progressByUser[agent.id] ?? {}
                  const totalCompleted = Object.values(agentProgress).reduce((a, b) => a + b, 0)
                  const overallPct = getModuleProgress(totalCompleted, totalSections)

                  return (
                    <tr key={agent.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium">{agent.preferred_name || agent.full_name}</p>
                          <p className="text-xs text-zinc-400">{agent.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs ${agent.license_number ? 'text-zinc-700' : 'text-zinc-300'}`}>
                          {agent.license_number || ' - '}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-zinc-900 rounded-full"
                              style={{ width: `${overallPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-500">{overallPct}%</span>
                        </div>
                      </td>
                      {MODULES.map(m => {
                        const completed = agentProgress[m.id] ?? 0
                        const pct = getModuleProgress(completed, m.totalSections)
                        return (
                          <td key={m.id} className="px-3 py-4">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              pct === 100
                                ? 'bg-emerald-50 text-emerald-700'
                                : pct > 0
                                ? 'bg-zinc-100 text-zinc-600'
                                : 'text-zinc-300'
                            }`}>
                              {pct === 100 ? '✓' : pct > 0 ? `${pct}%` : ' - '}
                            </span>
                          </td>
                        )
                      })}
                      <td className="px-5 py-4">
                        <span className="text-xs text-zinc-400">
                          {new Date(agent.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {(!profiles || profiles.length === 0) && (
              <div className="text-center py-12 text-zinc-400 text-sm">No agents yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
