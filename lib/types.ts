export interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export type NewPost = Omit<Post, 'id' | 'created_at' | 'updated_at'>

export interface Skill {
  id: number
  title: string
  title_en: string
  slug: string
  summary: string | null
  summary_en: string | null
  content: string
  content_en: string
  category: string | null
  tags: string[]
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type NewSkill = Omit<Skill, 'id' | 'created_at' | 'updated_at'>
