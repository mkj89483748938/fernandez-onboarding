export type Profile = {
  id: string
  full_name: string
  preferred_name: string | null
  email: string
  phone: string | null
  license_number: string | null
  headshot_url: string | null
  created_at: string
}

export type ModuleProgress = {
  id: string
  user_id: string
  module_id: string
  section_id: string
  completed: boolean
  completed_at: string | null
}

export type Module = {
  id: string
  title: string
  description: string
  icon: string
  sections: Section[]
}

export type Section = {
  id: string
  title: string
  type: 'checklist' | 'content' | 'walkthrough' | 'script'
}
