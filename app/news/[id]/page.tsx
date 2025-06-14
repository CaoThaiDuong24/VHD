import { getNewsById, getAllNews } from '@/lib/newsData'
import NewsDetailClient from './NewsDetailClient'

// Generate static params for all news items
export async function generateStaticParams() {
  const allNews = getAllNews()
  return allNews.map((news) => ({
    id: news.id.toString(),
  }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  return <NewsDetailClient params={resolvedParams} />
} 