import Link from 'next/link';

export const metadata = {
  title: "Blog - Multi-Platform Downloader",
  description: "Read the latest news, updates, and articles from the Multi-Platform Downloader team.",
};

const BlogPage = () => {
  // In a real app, you would fetch these from a CMS
  const posts = [
    {
      slug: 'the-ultimate-guide-to-downloading-videos',
      title: 'The Ultimate Guide to Downloading Videos in 2024',
      excerpt: 'Learn about the best practices for downloading videos online, including tips for staying safe and respecting copyright.',
      date: 'September 5, 2024',
    },
     {
      slug: 'announcing-support-for-21-platforms',
      title: 'Announcing Support for 21 Platforms!',
      excerpt: 'We are thrilled to announce that our downloader now supports over 20 of the most popular social media and video platforms.',
      date: 'September 1, 2024',
    },
  ];

  return (
    <div className="prose dark:prose-invert mx-auto">
      <h1>Blog</h1>
      <p>Welcome to our blog! Here you&apos;ll find the latest news, updates, and guides related to our service and online video downloading.</p>

      <div className="not-prose mt-8 space-y-8">
        {posts.map((post) => (
          <div key={post.slug} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{post.date}</p>
            <p className="mt-4 text-gray-700 dark:text-gray-300">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-blue-600 dark:text-blue-500 hover:underline mt-4 inline-block">
              Read more &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
