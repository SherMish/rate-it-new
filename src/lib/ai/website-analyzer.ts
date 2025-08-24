import OpenAI from 'openai';
import { ScrapedContent } from '../scraping/website-scraper';
import categoriesData from '../data/categories.json';

export interface AIAnalysisResult {
  name: string; // Business name in Hebrew
  nameEnglish?: string; // Business name in English
  shortDescription: string; // Up to 100 chars
  description: string; // Up to 1000 chars
  categories: string[]; // Up to 3 categories from categories.json
  launchYear?: number;
  address?: string;
  contact: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  socialUrls: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
  };
  confidence: number; // 0-1 score of analysis confidence
  warnings: string[]; // Any issues or limitations in the analysis
}

export class WebsiteAnalyzer {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeWebsite(scrapedContent: ScrapedContent): Promise<AIAnalysisResult> {
    try {
      const warnings: string[] = [];
      
      if (scrapedContent.error) {
        warnings.push(`Scraping issue: ${scrapedContent.error}`);
      }

      // Step 1: Basic content analysis
      const basicAnalysis = await this.analyzeBasicContent(scrapedContent);
      
      // Step 2: Category mapping
      const categories = await this.categorizeWebsite(scrapedContent);
      
      // Step 3: Contact extraction
      const contactInfo = await this.extractContactInfo(scrapedContent);
      
      // Step 4: Social media extraction
      const socialUrls = this.extractSocialUrls(scrapedContent);

      // Calculate confidence based on available data
      const confidence = this.calculateConfidence(scrapedContent, basicAnalysis, contactInfo);

      return {
        name: basicAnalysis.name || 'עסק ללא שם',
        nameEnglish: basicAnalysis.nameEnglish,
        shortDescription: basicAnalysis.shortDescription || '',
        description: basicAnalysis.description || '',
        categories,
        launchYear: basicAnalysis.launchYear,
        address: basicAnalysis.address,
        contact: contactInfo,
        socialUrls,
        confidence,
        warnings
      };
    } catch (error) {
      console.error('AI Analysis error:', error);
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async analyzeBasicContent(content: ScrapedContent): Promise<Partial<AIAnalysisResult>> {
    const allContent = [
      content.mainPage.title,
      content.mainPage.description,
      content.mainPage.content,
      content.aboutPage?.content || '',
      content.contactPage?.content || ''
    ].join('\n\n').substring(0, 8000); // Limit content for API

    const prompt = `
You are analyzing a website to extract business information. Analyze the following website content and extract:

1. Business name in Hebrew (if available)
2. Business name in English (if available)
3. Short description (80-100 characters)
4. Long description (max 1000 characters)
5. Launch year (if mentioned)
6. Address (if available)

Website Content:
"""
${allContent}
"""

Important guidelines:
- Prefer Hebrew content for descriptions if available
- If business name is only in English, provide Hebrew translation if you can infer it
- Descriptions should be marketing-friendly and professional
- If launch year is not clear, don't guess
- Address should be complete if found

Respond in JSON format:
{
  "name": "שם העסק בעברית",
  "nameEnglish": "Business Name in English",
  "shortDescription": "תיאור קצר עד 100 תווים",
  "description": "תיאור מפורט עד 1000 תווים שמסביר מה העסק עושה ומה הוא מציע",
  "launchYear": 2020,
  "address": "כתובת מלאה אם נמצאה"
}
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 1500
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      name: result.name || '',
      nameEnglish: result.nameEnglish,
      shortDescription: result.shortDescription?.substring(0, 100) || '',
      description: result.description?.substring(0, 1000) || '',
      launchYear: result.launchYear,
      address: result.address
    };
  }

  private async categorizeWebsite(content: ScrapedContent): Promise<string[]> {
    const allContent = [
      content.mainPage.title,
      content.mainPage.description,
      content.mainPage.content,
      content.aboutPage?.content || ''
    ].join('\n\n').substring(0, 5000);

    const categoryList = categoriesData.categories.map(cat => `${cat.id}: ${cat.name} - ${cat.description}`).join('\n');

    const prompt = `
You need to categorize a business based on its website content. Choose up to 3 most relevant categories from the provided list.

Available Categories:
${categoryList}

Website Content:
"""
${allContent}
"""

Instructions:
- Choose maximum 3 categories that best describe the business
- Prioritize the most specific and relevant categories
- Consider the main business activities described in the content
- Use category IDs only (not names)

Respond in JSON format:
{
  "categories": ["category_id1", "category_id2", "category_id3"]
}
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    const categories = result.categories || [];
    
    // Validate categories exist in our data
    const validCategories = categories.filter((catId: string) => 
      categoriesData.categories.some(cat => cat.id === catId)
    );

    return validCategories.slice(0, 3); // Ensure max 3 categories
  }

  private async extractContactInfo(content: ScrapedContent): Promise<AIAnalysisResult['contact']> {
    const contactSources = [
      content.contactPage?.content || '',
      content.mainPage.content,
      content.aboutPage?.content || '',
      content.emails.join(', '),
      content.phones.join(', ')
    ].join('\n\n');

    const prompt = `
Extract contact information from the following content. Look for:
1. Email addresses (business emails, not personal or generic ones)
2. Phone numbers (Israeli format preferred)
3. WhatsApp numbers or links

Content:
"""
${contactSources}
"""

Guidelines:
- Prefer business/main contact emails over personal ones
- Format phone numbers in Israeli format (e.g., 050-1234567)
- WhatsApp can be a phone number or full wa.me link
- Only extract if clearly associated with the business

Respond in JSON format:
{
  "email": "main.business@email.com",
  "phone": "050-1234567",
  "whatsapp": "972501234567"
}
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 300
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      email: result.email || undefined,
      phone: result.phone || undefined,
      whatsapp: result.whatsapp || undefined
    };
  }

  private extractSocialUrls(content: ScrapedContent): AIAnalysisResult['socialUrls'] {
    const socialUrls: AIAnalysisResult['socialUrls'] = {};
    
    // Process scraped social links
    for (const link of content.socialLinks) {
      try {
        const url = new URL(link);
        const hostname = url.hostname.toLowerCase();
        
        if (hostname.includes('facebook.com')) {
          socialUrls.facebook = link;
        } else if (hostname.includes('instagram.com')) {
          socialUrls.instagram = link;
        } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
          socialUrls.twitter = link;
        } else if (hostname.includes('linkedin.com')) {
          socialUrls.linkedin = link;
        } else if (hostname.includes('youtube.com')) {
          socialUrls.youtube = link;
        } else if (hostname.includes('tiktok.com')) {
          socialUrls.tiktok = link;
        }
      } catch (error) {
        // Skip invalid URLs
        continue;
      }
    }

    return socialUrls;
  }

  private calculateConfidence(
    content: ScrapedContent, 
    basicAnalysis: Partial<AIAnalysisResult>,
    contactInfo: AIAnalysisResult['contact']
  ): number {
    let score = 0;
    let maxScore = 0;

    // Main content quality (30%)
    maxScore += 30;
    if (content.mainPage.title) score += 10;
    if (content.mainPage.description) score += 10;
    if (content.mainPage.content.length > 500) score += 10;

    // Business info extraction (40%)
    maxScore += 40;
    if (basicAnalysis.name) score += 15;
    if (basicAnalysis.shortDescription) score += 10;
    if (basicAnalysis.description) score += 15;

    // Contact info (20%)
    maxScore += 20;
    if (contactInfo.email) score += 8;
    if (contactInfo.phone) score += 6;
    if (contactInfo.whatsapp) score += 6;

    // Additional pages (10%)
    maxScore += 10;
    if (content.aboutPage) score += 5;
    if (content.contactPage) score += 5;

    return Math.round((score / maxScore) * 100) / 100;
  }
}
