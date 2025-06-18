import NewsDetailClient from './NewsDetailClient'

// Since we're using dynamic data from context, we'll handle this dynamically
export const dynamicParams = true

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  return <NewsDetailClient params={resolvedParams} />
} 