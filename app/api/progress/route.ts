import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { moduleId, sectionId, completed } = await request.json()

  const { error } = await supabase
    .from('module_progress')
    .upsert({
      user_id: user.id,
      module_id: moduleId,
      section_id: sectionId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,module_id,section_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('module_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('completed', true)

  return NextResponse.json(data ?? [])
}
