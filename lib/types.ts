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
