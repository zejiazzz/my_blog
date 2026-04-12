import { getAllPosts } from '@/lib/actions';
import PostCard from '@/components/PostCard';

export default async function HomePage() {
  const posts = await getAllPosts(true);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
