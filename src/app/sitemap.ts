import { MetadataRoute } from 'next'
import connectDB from '@/lib/mongodb'
import Website from '@/lib/models/Website'
import categoriesData from '@/lib/data/categories.json'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rateit.co.il'
  
  try {
    await connectDB()
    
    // Get all websites for tool pages
    const websites = await Website.find({ isActive: { $ne: false } })
      .select('url updatedAt')
      .lean()
    
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/business`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/business/register`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/search`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ]
    
    // Tool/Business pages
    const toolPages: MetadataRoute.Sitemap = websites.map((website) => ({
      url: `${baseUrl}/tool/${website.url}`,
      lastModified: website.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))
    
    // Category pages
    const categoryPages: MetadataRoute.Sitemap = categoriesData.categories.map((category) => ({
      url: `${baseUrl}/category/${category.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    
    return [
      ...staticPages,
      ...toolPages,
      ...categoryPages,
    ]
    
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return basic sitemap if database fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/business`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
    ]
  }
}
