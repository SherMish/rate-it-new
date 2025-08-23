import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rateit.co.il'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/business/dashboard/',
          '/_next/',
          '/private/',
          '*.json',
          '/auth/',
          '/reset-password/',
          '/forgot-password/',
        ],
      },
      // Allow search engines to crawl important paths
      {
        userAgent: '*',
        allow: [
          '/tool/',
          '/category/',
          '/search',
          '/business',
          '/about',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
