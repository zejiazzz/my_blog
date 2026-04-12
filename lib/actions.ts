'use server';

import { revalidatePath } from 'next/cache';
import { eq, desc } from 'drizzle-orm';
import { db } from './db';
import { posts, NewPost } from './schema';

export async function getAllPosts(publishedOnly?: boolean) {
  if (publishedOnly) {
    return db
      .select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt));
  }
  return db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getPostBySlug(slug: string) {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function getPostById(id: number) {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published?: boolean;
}) {
  const result = await db
    .insert(posts)
    .values({
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt ?? null,
      published: data.published ?? false,
    })
    .returning();
  revalidatePath('/');
  return result[0];
}

export async function updatePost(id: number, data: Partial<NewPost>) {
  const result = await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  revalidatePath('/');
  revalidatePath(`/posts/${result[0]?.slug ?? ''}`);
  return result[0] ?? null;
}

export async function deletePost(id: number) {
  const result = await db
    .delete(posts)
    .where(eq(posts.id, id))
    .returning();
  revalidatePath('/');
  return result[0] ?? null;
}
