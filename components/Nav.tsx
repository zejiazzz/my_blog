import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-3xl mx-auto px-4 py-4 flex gap-6">
        <Link href="/" className="font-semibold text-gray-900 hover:text-gray-600">
          Blog
        </Link>
        <Link href="/admin" className="text-gray-600 hover:text-gray-900">
          Admin
        </Link>
      </div>
    </nav>
  );
}
