import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkAdminAuth } from '@/lib/admin-auth';
import { WebsiteScraper } from '@/lib/scraping/website-scraper';
import { WebsiteAnalyzer } from '@/lib/ai/website-analyzer';

// Force Node.js runtime (required for puppeteer)
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds max execution

export async function POST(request: Request) {
  // Check admin authentication
  const authError = await checkAdminAuth();
  if (authError) return authError;

  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log(`Starting AI analysis for URL: ${url}`);

    // Step 1: Scrape website content
    const scraper = new WebsiteScraper();
    let scrapedContent;
    
    try {
      scrapedContent = await scraper.scrapeWebsite(url);
      console.log('Scraping completed:', {
        mainPageLength: scrapedContent.mainPage.content.length,
        hasAboutPage: !!scrapedContent.aboutPage,
        hasContactPage: !!scrapedContent.contactPage,
        socialLinksFound: scrapedContent.socialLinks.length,
        emailsFound: scrapedContent.emails.length,
        phonesFound: scrapedContent.phones.length
      });
    } finally {
      // Always cleanup browser resources
      await scraper.cleanup();
    }

    // Check if we got meaningful content
    if (!scrapedContent.mainPage.content && !scrapedContent.mainPage.title) {
      return NextResponse.json(
        { 
          error: 'Could not extract meaningful content from the website. The site might be protected, require JavaScript, or be temporarily unavailable.',
          scrapingError: scrapedContent.error
        },
        { status: 422 }
      );
    }

    // Step 2: Analyze content with AI
    const analyzer = new WebsiteAnalyzer();
    const analysis = await analyzer.analyzeWebsite(scrapedContent);

    console.log('AI analysis completed:', {
      confidence: analysis.confidence,
      categoriesFound: analysis.categories.length,
      hasContact: !!(analysis.contact.email || analysis.contact.phone),
      warnings: analysis.warnings.length
    });

    // Return the analysis results
    return NextResponse.json({
      success: true,
      data: analysis,
      metadata: {
        analyzedAt: new Date().toISOString(),
        sourcePages: {
          main: !!scrapedContent.mainPage.content,
          about: !!scrapedContent.aboutPage,
          contact: !!scrapedContent.contactPage
        }
      }
    });

  } catch (error) {
    console.error('AI analysis error:', error);
    
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('OPENAI_API_KEY')) {
        return NextResponse.json(
          { error: 'AI service configuration error' },
          { status: 500 }
        );
      }
      
      if (error.message.includes('timeout') || error.message.includes('network')) {
        return NextResponse.json(
          { error: 'Network timeout - the website might be slow or unavailable' },
          { status: 408 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to analyze website',
        details: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.message : 'Unknown error') : 
          undefined
      },
      { status: 500 }
    );
  }
}

// Rate limiting for AI analysis (optional)
export async function GET() {
  return NextResponse.json(
    { 
      message: 'AI Website Analysis API',
      endpoint: 'POST /api/admin/ai-analyze-website',
      requirements: ['Admin authentication', 'URL parameter'],
      features: [
        'Content scraping from main/about/contact pages',
        'AI-powered business information extraction',
        'Category mapping from categories.json',
        'Contact information extraction',
        'Social media links detection',
        'Confidence scoring'
      ]
    },
    { status: 200 }
  );
}
