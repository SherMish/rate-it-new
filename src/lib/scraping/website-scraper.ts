import puppeteer, { Browser, Page } from 'puppeteer';

export interface ScrapedContent {
  mainPage: {
    title: string;
    description: string;
    content: string;
    links: string[];
    linkData?: { href: string, text: string, context: string }[];
  };
  aboutPage?: {
    content: string;
    url: string;
  };
  contactPage?: {
    content: string;
    url: string;
  };
  socialLinks: string[];
  emails: string[];
  phones: string[];
  error?: string;
}

export class WebsiteScraper {
  private browser: Browser | null = null;

  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
    }
  }

  async scrapeWebsite(url: string): Promise<ScrapedContent> {
    try {
      await this.initialize();
      if (!this.browser) throw new Error('Failed to initialize browser');

      const normalizedUrl = this.normalizeUrl(url);
      const page = await this.browser.newPage();
      
      // Set user agent and viewport
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });

      // Set timeout
      page.setDefaultTimeout(30000);

      // Scrape main page and extract navigation links intelligently
      const mainPage = await this.scrapeMainPage(page, normalizedUrl);
      
      // Use AI-powered navigation detection to find about and contact pages
      const navigationAnalysis = await this.analyzeNavigation(mainPage.links, normalizedUrl, mainPage.linkData);
      
      // Find and scrape about page using intelligent detection
      const aboutPage = await this.findAndScrapeAboutPage(page, normalizedUrl, navigationAnalysis.aboutUrls);
      
      // Find and scrape contact page using intelligent detection
      const contactPage = await this.findAndScrapeContactPage(page, normalizedUrl, navigationAnalysis.contactUrls);

      // Extract contact information and social links
      const allContent = [mainPage.content, aboutPage?.content || '', contactPage?.content || ''].join(' ');
      const socialLinks = this.extractSocialLinks(allContent + mainPage.links.join(' '));
      const emails = this.extractEmails(allContent);
      const phones = this.extractPhones(allContent);

      await page.close();

      return {
        mainPage,
        aboutPage,
        contactPage,
        socialLinks,
        emails,
        phones
      };
    } catch (error) {
      console.error('Scraping error:', error);
      return {
        mainPage: { title: '', description: '', content: '', links: [] },
        socialLinks: [],
        emails: [],
        phones: [],
        error: error instanceof Error ? error.message : 'Unknown scraping error'
      };
    }
  }

  private normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }

  private async scrapeMainPage(page: Page, url: string) {
    await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    // Wait a bit for dynamic content but don't wait for all network activity
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = await page.evaluate(() => {
      // Extract title
      const title = document.title || '';

      // Extract meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      const description = metaDesc?.getAttribute('content') || '';

      // Extract main content (excluding header, footer, nav)
      const contentSelectors = [
        'main',
        '[role="main"]',
        '.main-content',
        '.content',
        '#content',
        '.container',
        'body'
      ];

      let content = '';
      for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          // Remove scripts, styles, and navigation elements
          const cloned = element.cloneNode(true) as Element;
          const unwanted = cloned.querySelectorAll('script, style, nav, header, footer, .navigation, .menu');
          unwanted.forEach(el => el.remove());
          
          content = cloned.textContent || '';
          if (content.length > 200) break; // Found substantial content
        }
      }

      // Extract all links with their text content for intelligent analysis
      const links: string[] = [];
      const linkData: { href: string, text: string, context: string }[] = [];
      
      document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          links.push(href);
          
          // Extract link text and surrounding context
          const linkText = (link.textContent || '').trim();
          const parent = link.parentElement;
          let context = '';
          
          // Try to get better context by looking at parent elements
          if (parent) {
            // Check if link is in navigation, footer, or header
            let currentElement: HTMLElement | null = parent;
            for (let i = 0; i < 3 && currentElement; i++) {
              const tagName = currentElement.tagName?.toLowerCase();
              const className = currentElement.className?.toLowerCase() || '';
              const id = currentElement.id?.toLowerCase() || '';
              
              if (tagName === 'nav' || className.includes('nav') || id.includes('nav')) {
                context += ' navigation ';
              }
              if (tagName === 'footer' || className.includes('footer') || id.includes('footer')) {
                context += ' footer ';
              }
              if (tagName === 'header' || className.includes('header') || id.includes('header')) {
                context += ' header ';
              }
              if (className.includes('menu') || id.includes('menu')) {
                context += ' menu ';
              }
              
              currentElement = currentElement.parentElement;
            }
            
            // Get surrounding text content
            const parentText = (parent.textContent || '').trim().substring(0, 150);
            context += ' ' + parentText;
          }
          
          linkData.push({
            href,
            text: linkText,
            context: context.trim()
          });
        }
      });

      return {
        title: title.trim(),
        description: description.trim(),
        content: content.trim().substring(0, 5000), // Limit content size
        links: Array.from(new Set(links)), // Remove duplicates
        linkData: linkData // Enhanced link information for intelligent navigation
      };
    });

    return result;
  }

  private async analyzeNavigation(links: string[], baseUrl: string, linkData?: { href: string, text: string, context: string }[]): Promise<{ aboutUrls: string[], contactUrls: string[] }> {
    const baseHost = new URL(baseUrl).hostname;
    const internalLinks: { url: string, text: string, path: string, context: string }[] = [];

    // Use enhanced link data if available, otherwise fall back to basic link analysis
    if (linkData && linkData.length > 0) {
      for (const linkInfo of linkData) {
        try {
          let fullUrl: string;

          if (linkInfo.href.startsWith('http')) {
            fullUrl = linkInfo.href;
            // Skip external links
            if (!fullUrl.includes(baseHost)) continue;
          } else {
            const url = new URL(baseUrl);
            fullUrl = new URL(linkInfo.href, url.origin).href;
          }

          const path = new URL(fullUrl).pathname.toLowerCase();
          
          internalLinks.push({ 
            url: fullUrl, 
            text: linkInfo.text.toLowerCase(), 
            path,
            context: linkInfo.context.toLowerCase()
          });
        } catch (error) {
          continue; // Skip malformed URLs
        }
      }
    } else {
      // Fallback to basic link analysis
      for (const link of links) {
        try {
          let fullUrl: string;

          if (link.startsWith('http')) {
            fullUrl = link;
            // Skip external links
            if (!fullUrl.includes(baseHost)) continue;
          } else {
            const url = new URL(baseUrl);
            fullUrl = new URL(link, url.origin).href;
          }

          const path = new URL(fullUrl).pathname.toLowerCase();
          const linkText = this.getLinkTextFromPath(path);
          
          internalLinks.push({ url: fullUrl, text: linkText, path, context: '' });
        } catch (error) {
          continue; // Skip malformed URLs
        }
      }
    }

    // Intelligent matching for about pages
    const aboutUrls = this.findPagesByIntelligentMatching(internalLinks, 'about');
    
    // Intelligent matching for contact pages  
    const contactUrls = this.findPagesByIntelligentMatching(internalLinks, 'contact');

    return { aboutUrls, contactUrls };
  }

  private getLinkTextFromPath(path: string): string {
    // Extract meaningful text from URL path
    const segments = path.split('/').filter(segment => segment.length > 0);
    return segments.join(' ').replace(/[-_]/g, ' ');
  }

  private findPagesByIntelligentMatching(links: { url: string, text: string, path: string, context: string }[], pageType: 'about' | 'contact'): string[] {
    const patterns = pageType === 'about' ? {
      exact: ['/about', '/about-us', '/אודות', '/עלינו', '/about.html', '/about-us.html', '/מי-אנחנו'],
      partial: ['about', 'אודות', 'עלינו', 'קצת עלינו', 'עלי', 'מי אנחנו', 'מי אני', 'our story', 'who we are', 'מי-אנחנו'],
      keywords: ['story', 'team', 'history', 'mission', 'vision', 'company', 'סיפור', 'צוות', 'היסטוריה', 'משימה', 'חזון', 'חברה']
    } : {
      exact: ['/contact', '/contact-us', '/צור-קשר', '/יצירת-קשר', '/contact.html', '/contact-us.html', '/צרו-קשר'],
      partial: [
        'contact', 'צור-קשר', 'יצירת-קשר', 'צרו קשר', 'בואו נדבר', 'דברו איתנו', 'reach out', 'get in touch',
        'צור קשר', 'צרו-קשר', 'יצירת קשר', 'ליצירת קשר', 'פרטי התקשרות', 'דרכי התקשרות'
      ],
      keywords: [
        'phone', 'email', 'address', 'location', 'reach', 'טלפון', 'אימייל', 'כתובת', 'מיקום', 'הגעה',
        'התקשרות', 'פרטים', 'מידע נוסף', 'פניות', 'שאלות', 'עזרה', 'תמיכה', 'support', 'help'
      ]
    };

    const matchedUrls: { url: string, score: number }[] = [];

    for (const link of links) {
      let score = 0;
      const combinedText = (link.path + ' ' + link.text + ' ' + link.context).toLowerCase();
      const decodedUrl = decodeURIComponent(link.url).toLowerCase();

      // Exact path matches (highest priority) - check both encoded and decoded URLs
      for (const exact of patterns.exact) {
        if (link.path.includes(exact.toLowerCase()) || decodedUrl.includes(exact.toLowerCase())) {
          score += 100;
          break;
        }
      }

      // Partial matches in path, text, or context (medium priority)
      for (const partial of patterns.partial) {
        if (combinedText.includes(partial.toLowerCase()) || decodedUrl.includes(partial.toLowerCase())) {
          score += 50;
          // Bonus points if match is in link text (more reliable than context)
          if (link.text.includes(partial.toLowerCase())) {
            score += 25;
          }
        }
      }

      // Keyword matches (lower priority)
      for (const keyword of patterns.keywords) {
        if (combinedText.includes(keyword.toLowerCase()) || decodedUrl.includes(keyword.toLowerCase())) {
          score += 20;
          // Bonus for keyword in link text
          if (link.text.includes(keyword.toLowerCase())) {
            score += 10;
          }
        }
      }

      // Special handling for Hebrew URL encoding
      if (pageType === 'contact') {
        const hebrewContactPatterns = [
          '%d7%a6%d7%95%d7%a8-%d7%a7%d7%a9%d7%a8', // צור-קשר
          '%d7%a6%d7%a8%d7%95-%d7%a7%d7%a9%d7%a8', // צרו-קשר
          '%d7%99%d7%a6%d7%99%d7%a8%d7%aa-%d7%a7%d7%a9%d7%a8' // יצירת-קשר
        ];
        
        for (const pattern of hebrewContactPatterns) {
          if (link.url.toLowerCase().includes(pattern)) {
            score += 120; // Higher than exact matches due to specificity
            break;
          }
        }
      } else if (pageType === 'about') {
        const hebrewAboutPatterns = [
          '%d7%90%d7%95%d7%93%d7%95%d7%aa', // אודות
          '%d7%9e%d7%99-%d7%90%d7%a0%d7%97%d7%a0%d7%95', // מי-אנחנו
          '%d7%a2%d7%9c%d7%99%d7%a0%d7%95' // עלינו
        ];
        
        for (const pattern of hebrewAboutPatterns) {
          if (link.url.toLowerCase().includes(pattern)) {
            score += 120; // Higher than exact matches due to specificity
            break;
          }
        }
      }

      // Avoid common false positives
      const falsePosivites = ['blog', 'news', 'products', 'services', 'home', 'portfolio', 'gallery', 'shop', 'store', 'cart'];
      for (const falsePos of falsePosivites) {
        if (combinedText.includes(falsePos)) {
          score -= 30;
        }
      }

      // Boost score for navigation/menu links (typically more reliable)
      if (link.context.includes('nav') || link.context.includes('menu') || link.context.includes('navigation')) {
        score += 15;
      }

      // Boost score for footer links (contact often in footer)
      if (pageType === 'contact' && link.context.includes('footer')) {
        score += 10;
      }

      if (score > 0) {
        matchedUrls.push({ url: link.url, score });
      }
    }

    // Sort by score and return top matches
    return matchedUrls
      .sort((a, b) => b.score - a.score)
      .slice(0, 3) // Take top 3 candidates
      .map(match => match.url);
  }

  private async findAndScrapeAboutPage(page: Page, baseUrl: string, candidateUrls: string[]): Promise<{ content: string; url: string } | undefined> {
    // If no intelligent candidates found, fall back to basic pattern matching
    if (candidateUrls.length === 0) {
      const aboutPatterns = [
        '/about',
        '/about-us',
        '/אודות',
        '/עלינו',
        '/about.html',
        '/about-us.html',
        'about',
        'אודות'
      ];
      
      // Get all links from the page for fallback
      const allLinks = await page.evaluate(() => {
        const links: string[] = [];
        document.querySelectorAll('a[href]').forEach(link => {
          const href = link.getAttribute('href');
          if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
            links.push(href);
          }
        });
        return Array.from(new Set(links));
      });
      
      const fallbackUrl = this.findPageByPatterns(allLinks, aboutPatterns, baseUrl);
      if (fallbackUrl) candidateUrls = [fallbackUrl];
    }

    // Try each candidate URL until we find one that works
    for (const aboutUrl of candidateUrls) {
      try {
        await page.goto(aboutUrl, { 
          waitUntil: 'domcontentloaded',
          timeout: 15000 
        });
        
        // Brief wait for dynamic content
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const content = await page.evaluate(() => {
          const contentSelectors = ['main', '[role="main"]', '.content', '#content', '.about', '.about-content', 'body'];
          
          for (const selector of contentSelectors) {
            const element = document.querySelector(selector);
            if (element) {
              const cloned = element.cloneNode(true) as Element;
              const unwanted = cloned.querySelectorAll('script, style, nav, header, footer, .navigation, .menu');
              unwanted.forEach(el => el.remove());
              
              const text = cloned.textContent || '';
              if (text.length > 100) return text.trim().substring(0, 3000);
            }
          }
          return '';
        });

        if (content.length > 100) {
          return { content, url: aboutUrl };
        }
      } catch (error) {
        console.error(`Error scraping about page ${aboutUrl}:`, error);
        continue; // Try next candidate
      }
    }

    return undefined;
  }

  private async findAndScrapeContactPage(page: Page, baseUrl: string, candidateUrls: string[]): Promise<{ content: string; url: string } | undefined> {
    // If no intelligent candidates found, fall back to basic pattern matching
    if (candidateUrls.length === 0) {
      const contactPatterns = [
        '/contact',
        '/contact-us',
        '/צור-קשר',
        '/יצירת-קשר',
        '/contact.html',
        '/contact-us.html',
        'contact',
        'צור-קשר'
      ];
      
      // Get all links from the page for fallback
      const allLinks = await page.evaluate(() => {
        const links: string[] = [];
        document.querySelectorAll('a[href]').forEach(link => {
          const href = link.getAttribute('href');
          if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
            links.push(href);
          }
        });
        return Array.from(new Set(links));
      });
      
      const fallbackUrl = this.findPageByPatterns(allLinks, contactPatterns, baseUrl);
      if (fallbackUrl) candidateUrls = [fallbackUrl];
    }

    // Try each candidate URL until we find one that works
    for (const contactUrl of candidateUrls) {
      try {
        await page.goto(contactUrl, { 
          waitUntil: 'domcontentloaded',
          timeout: 15000 
        });
        
        // Brief wait for dynamic content
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const content = await page.evaluate(() => {
          const contentSelectors = ['main', '[role="main"]', '.content', '#content', '.contact', '.contact-content', 'body'];
          
          for (const selector of contentSelectors) {
            const element = document.querySelector(selector);
            if (element) {
              const cloned = element.cloneNode(true) as Element;
              const unwanted = cloned.querySelectorAll('script, style, nav, header, footer, .navigation, .menu');
              unwanted.forEach(el => el.remove());
              
              const text = cloned.textContent || '';
              if (text.length > 50) return text.trim().substring(0, 2000);
            }
          }
          return '';
        });

        if (content.length > 50) {
          return { content, url: contactUrl };
        }
      } catch (error) {
        console.error(`Error scraping contact page ${contactUrl}:`, error);
        continue; // Try next candidate
      }
    }

    return undefined;
  }

  private findPageByPatterns(links: string[], patterns: string[], baseUrl: string): string | null {
    const baseHost = new URL(baseUrl).hostname;

    for (const link of links) {
      let fullUrl: string;
      
      try {
        if (link.startsWith('http')) {
          fullUrl = link;
          // Skip external links
          if (!fullUrl.includes(baseHost)) continue;
        } else {
          const url = new URL(baseUrl);
          fullUrl = new URL(link, url.origin).href;
        }

        const path = new URL(fullUrl).pathname.toLowerCase();
        
        for (const pattern of patterns) {
          if (path.includes(pattern.toLowerCase())) {
            return fullUrl;
          }
        }
      } catch (error) {
        continue; // Skip malformed URLs
      }
    }

    return null;
  }

  private extractSocialLinks(content: string): string[] {
    const socialPatterns = [
      /https?:\/\/(?:www\.)?facebook\.com\/[^\s]+/gi,
      /https?:\/\/(?:www\.)?instagram\.com\/[^\s]+/gi,
      /https?:\/\/(?:www\.)?twitter\.com\/[^\s]+/gi,
      /https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+/gi,
      /https?:\/\/(?:www\.)?youtube\.com\/[^\s]+/gi,
      /https?:\/\/(?:www\.)?tiktok\.com\/[^\s]+/gi,
    ];

    const socialLinks: string[] = [];
    
    for (const pattern of socialPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        socialLinks.push(...matches);
      }
    }

    return Array.from(new Set(socialLinks)); // Remove duplicates
  }

  private extractEmails(content: string): string[] {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = content.match(emailPattern) || [];
    
    // Filter out common false positives
    const filteredEmails = emails.filter(email => 
      !email.includes('example.') && 
      !email.includes('test@') &&
      !email.includes('noreply@') &&
      !email.includes('no-reply@')
    );
    
    return Array.from(new Set(filteredEmails));
  }

  private extractPhones(content: string): string[] {
    const phonePatterns = [
      /\b0\d{1,2}-?\d{7,8}\b/g, // Israeli format: 02-1234567, 050-1234567
      /\b\+972-?\d{1,2}-?\d{7,8}\b/g, // International Israeli: +972-2-1234567
      /\b\d{3}-\d{7,8}\b/g, // Format: 050-1234567
    ];

    const phones: string[] = [];
    
    for (const pattern of phonePatterns) {
      const matches = content.match(pattern);
      if (matches) {
        phones.push(...matches);
      }
    }

    return Array.from(new Set(phones)); // Remove duplicates
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
