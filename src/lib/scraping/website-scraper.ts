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
      
      // Scrape main page with retry logic using fresh pages
      const mainPage = await this.scrapeMainPageWithRetry(normalizedUrl);
      
      // Ensure mainPage is valid before proceeding
      if (!mainPage || !mainPage.links) {
        throw new Error('Failed to scrape main page content');
      }
      
      // Use AI-powered navigation detection to find about and contact pages
      const navigationAnalysis = await this.analyzeNavigation(mainPage.links, normalizedUrl, mainPage.linkData);
      
      // If main page scraping failed completely, try a simple HTTP fallback
      if (mainPage.content.length === 0 && mainPage.links.length === 0) {
        console.log('Main page scraping failed, attempting HTTP fallback...');
        const httpFallback = await this.simpleHttpFallback(normalizedUrl);
        
        // Use enhanced content for better contact extraction
        const contentForExtraction = (httpFallback as any).enhancedContent || httpFallback.content;
        const directSocialLinks = (httpFallback as any).socialLinks || [];
        console.log('Using enhanced content for extraction:', contentForExtraction.substring(0, 300));
        console.log('Direct social links from HTML:', directSocialLinks);
        
        // Combine social links from content extraction and direct HTML extraction
        const allSocialLinks = [
          ...this.extractSocialLinks(contentForExtraction),
          ...directSocialLinks
        ];
        
        return {
          mainPage: httpFallback,
          aboutPage: undefined,
          contactPage: undefined,
          socialLinks: Array.from(new Set(allSocialLinks)),
          emails: this.extractEmails(contentForExtraction),
          phones: this.extractPhones(contentForExtraction)
        };
      }
      
      // Find and scrape about page using fresh page instance
      const aboutPage = await this.findAndScrapeAboutPageWithRetry(normalizedUrl, navigationAnalysis.aboutUrls);
      
      // Find and scrape contact page using fresh page instance
      const contactPage = await this.findAndScrapeContactPageWithRetry(normalizedUrl, navigationAnalysis.contactUrls);

      // Extract contact information and social links
      const allContent = [mainPage.content, aboutPage?.content || '', contactPage?.content || ''].join(' ');
      
      // Also extract footer content specifically for contact information using fresh page
      const footerContent = await this.extractFooterContentWithRetry(normalizedUrl);
      console.log('Footer content extracted:', footerContent.substring(0, 200)); // Debug log
      const contentForContactExtraction = allContent + ' ' + footerContent;
      
      const socialLinks = this.extractSocialLinks(contentForContactExtraction + mainPage.links.join(' '));
      const emails = this.extractEmails(contentForContactExtraction);
      const phones = this.extractPhones(contentForContactExtraction);

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

  private async createFreshPage(): Promise<Page> {
    // Check if browser is still alive
    if (!this.browser || !this.browser.isConnected()) {
      console.log('Browser connection lost, reinitializing...');
      await this.cleanup();
      await this.initialize();
      
      if (!this.browser) throw new Error('Failed to reinitialize browser');
    }
    
    try {
      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });
      page.setDefaultTimeout(30000);
      return page;
    } catch (error) {
      console.error('Failed to create page, reinitializing browser:', error);
      // Browser is likely dead, reinitialize
      await this.cleanup();
      await this.initialize();
      
      if (!this.browser) throw new Error('Failed to reinitialize browser after page creation failure');
      
      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });
      page.setDefaultTimeout(30000);
      return page;
    }
  }

  private async scrapeMainPageWithRetry(url: string) {
    let retries = 2; // Reduced retries to prevent excessive browser crashes
    let browserReinitialized = false;
    
    while (retries > 0) {
      let page: Page | null = null;
      try {
        page = await this.createFreshPage();
        const result = await this.scrapeMainPage(page, url);
        await page.close();
        return result;
      } catch (error) {
        retries--;
        console.warn(`Main page scraping failed, retries left: ${retries}`, error);
        
        if (page) {
          try {
            await page.close();
          } catch (closeError) {
            console.warn('Failed to close page:', closeError);
          }
        }
        
        // If we get connection errors, the browser is likely dead
        if (error instanceof Error && error.message.includes('Connection closed')) {
          if (!browserReinitialized) {
            console.log('Browser connection lost, attempting to reinitialize...');
            await this.cleanup();
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before restart
            await this.initialize();
            browserReinitialized = true;
          } else {
            // Already tried reinitializing, give up
            console.error('Browser keeps crashing, giving up on this website');
            break;
          }
        }
        
        if (retries === 0) {
          // Return fallback result
          return {
            title: '',
            description: '',
            content: '',
            links: [],
            linkData: []
          };
        }
        
        await new Promise(resolve => setTimeout(resolve, 3000)); // Longer wait between retries
      }
    }
  }

  private async findAndScrapeAboutPageWithRetry(baseUrl: string, candidateUrls: string[]) {
    let retries = 2;
    
    while (retries > 0) {
      let page: Page | null = null;
      try {
        page = await this.createFreshPage();
        const result = await this.findAndScrapeAboutPage(page, baseUrl, candidateUrls);
        await page.close();
        return result;
      } catch (error) {
        retries--;
        console.warn(`About page scraping failed, retries left: ${retries}`, error);
        
        if (page) {
          try {
            await page.close();
          } catch (closeError) {
            console.warn('Failed to close page:', closeError);
          }
        }
        
        if (retries === 0) {
          return undefined;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  private async findAndScrapeContactPageWithRetry(baseUrl: string, candidateUrls: string[]) {
    let retries = 2;
    
    while (retries > 0) {
      let page: Page | null = null;
      try {
        page = await this.createFreshPage();
        const result = await this.findAndScrapeContactPage(page, baseUrl, candidateUrls);
        await page.close();
        return result;
      } catch (error) {
        retries--;
        console.warn(`Contact page scraping failed, retries left: ${retries}`, error);
        
        if (page) {
          try {
            await page.close();
          } catch (closeError) {
            console.warn('Failed to close page:', closeError);
          }
        }
        
        if (retries === 0) {
          return undefined;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  private async extractFooterContentWithRetry(url: string): Promise<string> {
    let retries = 2;
    
    while (retries > 0) {
      let page: Page | null = null;
      try {
        page = await this.createFreshPage();
        await page.goto(url, { 
          waitUntil: 'domcontentloaded',
          timeout: 15000 
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const result = await this.extractFooterContent(page);
        await page.close();
        return result;
      } catch (error) {
        retries--;
        console.warn(`Footer content extraction failed, retries left: ${retries}`, error);
        
        if (page) {
          try {
            await page.close();
          } catch (closeError) {
            console.warn('Failed to close page:', closeError);
          }
        }
        
        if (retries === 0) {
          return '';
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return '';
  }

  private async simpleHttpFallback(url: string) {
    try {
      console.log('Attempting simple HTTP fetch fallback...');
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      
      // Basic HTML parsing without Puppeteer
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : '';
      
      const descMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i);
      const description = descMatch ? descMatch[1].trim() : '';
      
      // Extract basic text content (very rough)
      let content = html
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<style[^>]*>.*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 3000);
      
      console.log('HTTP fallback extracted content sample:', content.substring(0, 500));
      
      // Enhanced content extraction - also try to preserve some structure for contact info
      let enhancedContent = html
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<style[^>]*>.*?<\/style>/gi, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Use enhanced content for better extraction but limit main content
      content = content.substring(0, 3000);
      
      // Extract basic links
      const linkMatches = html.match(/<a[^>]*href=["\']([^"']+)["\'][^>]*>/gi) || [];
      const links = linkMatches
        .map(match => {
          const hrefMatch = match.match(/href=["\']([^"']+)["\']/i);
          return hrefMatch ? hrefMatch[1] : null;
        })
        .filter(href => href && !href.startsWith('#') && !href.startsWith('javascript:'))
        .slice(0, 50); // Limit to 50 links
      
      // Also extract social links directly from HTML href attributes
      const socialPatterns = [
        /href=["\']([^"']*facebook\.com[^"']*)["\']?/gi,
        /href=["\']([^"']*instagram\.com[^"']*)["\']?/gi,
        /href=["\']([^"']*twitter\.com[^"']*)["\']?/gi,
        /href=["\']([^"']*linkedin\.com[^"']*)["\']?/gi,
        /href=["\']([^"']*youtube\.com[^"']*)["\']?/gi,
        /href=["\']([^"']*tiktok\.com[^"']*)["\']?/gi,
      ];
      
      const socialLinks: string[] = [];
      for (const pattern of socialPatterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          if (match[1]) {
            socialLinks.push(match[1]);
          }
        }
      }
      
      console.log('HTTP fallback found social links:', socialLinks);
      
      return {
        title,
        description,
        content,
        links: Array.from(new Set(links)) as string[],
        linkData: [], // Can't extract context without proper DOM parsing
        enhancedContent, // Add this for better contact extraction
        socialLinks: Array.from(new Set(socialLinks)) // Add extracted social links
      };
    } catch (error) {
      console.error('HTTP fallback failed:', error);
      return {
        title: '',
        description: '',
        content: '',
        links: [],
        linkData: []
      };
    }
  }

  private async scrapeMainPage(page: Page, url: string) {
    try {
      // Set additional safety measures
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        // Block potentially problematic resource types that might crash the browser
        const resourceType = req.resourceType();
        if (['font', 'image', 'media', 'websocket'].includes(resourceType)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 10000  // Reduced timeout to prevent hanging
      });
    } catch (error) {
      console.error('Failed to navigate to page:', error);
      // Try with an even more minimal approach
      try {
        await page.goto(url, { 
          waitUntil: 'load',
          timeout: 15000 
        });
      } catch (secondError) {
        console.error('Second navigation attempt failed:', secondError);
        throw secondError; // Let the retry logic handle this
      }
    }
    
    // Shorter wait time to reduce chance of crashes
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add timeout to the evaluation itself
    const result = await Promise.race([
      page.evaluate(() => {
        // Check if document is still available
        if (!document || !document.documentElement) {
          throw new Error('Document not available');
        }
        
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
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Page evaluation timeout')), 10000)
      )
    ]) as any;

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
      
      // Safely decode URL, fall back to original if malformed
      let decodedUrl: string;
      try {
        decodedUrl = decodeURIComponent(link.url).toLowerCase();
      } catch (error) {
        // If URL is malformed, use the original URL
        decodedUrl = link.url.toLowerCase();
      }

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
      let allLinks: string[] = [];
      try {
        allLinks = await page.evaluate(() => {
          if (!document || !document.documentElement) {
            return [];
          }
          const links: string[] = [];
          document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
              links.push(href);
            }
          });
          return Array.from(new Set(links));
        });
      } catch (error) {
        console.warn('Failed to extract links for about page fallback:', error);
        allLinks = [];
      }
      
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
        
        // Add retry logic for page evaluation
        let content = '';
        let retries = 2;
        
        while (retries > 0) {
          try {
            content = await page.evaluate(() => {
              if (!document || !document.documentElement) {
                throw new Error('Document not available');
              }
              
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
            break; // Success, exit retry loop
          } catch (error) {
            retries--;
            console.warn(`About page evaluation failed, retries left: ${retries}`, error);
            if (retries === 0) {
              content = ''; // Set empty content as fallback
            } else {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }

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
      let allLinks: string[] = [];
      try {
        allLinks = await page.evaluate(() => {
          if (!document || !document.documentElement) {
            return [];
          }
          const links: string[] = [];
          document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
              links.push(href);
            }
          });
          return Array.from(new Set(links));
        });
      } catch (error) {
        console.warn('Failed to extract links for contact page fallback:', error);
        allLinks = [];
      }
      
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
        
        // Add retry logic for page evaluation
        let content = '';
        let retries = 2;
        
        while (retries > 0) {
          try {
            content = await page.evaluate(() => {
              if (!document || !document.documentElement) {
                throw new Error('Document not available');
              }
              
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
            break; // Success, exit retry loop
          } catch (error) {
            retries--;
            console.warn(`Contact page evaluation failed, retries left: ${retries}`, error);
            if (retries === 0) {
              content = ''; // Set empty content as fallback
            } else {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }

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
    
    // Debug logging
    if (emails.length > 0) {
      console.log('Found emails:', emails);
    }
    
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
      /\b0\d{9,10}\b/g, // Israeli format without dashes: 0544450913
      /\b\+972\d{9,10}\b/g, // International Israeli without dashes: +972544450913
      /\b\d{10}\b/g, // 10-digit numbers: 0544450913 (less specific, so last)
    ];

    const phones: string[] = [];
    
    for (const pattern of phonePatterns) {
      const matches = content.match(pattern);
      if (matches) {
        phones.push(...matches);
      }
    }

    // Also extract WhatsApp numbers (often marked differently)
    const whatsappPatterns = [
      /whatsapp[:\s]*(\+?\d[\d\s\-\(\)]{8,})/gi,
      /wa[:\s]*(\+?\d[\d\s\-\(\)]{8,})/gi,
      /וואטסאפ[:\s]*(\+?\d[\d\s\-\(\)]{8,})/gi, // Hebrew WhatsApp
    ];

    for (const pattern of whatsappPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1]) {
          phones.push(match[1].replace(/[\s\-\(\)]/g, '')); // Clean up the number
        }
      }
    }

    // Debug logging
    if (phones.length > 0) {
      console.log('Found phones:', phones);
    }

    return Array.from(new Set(phones)); // Remove duplicates
  }

  private async extractFooterContent(page: Page): Promise<string> {
    try {
      const footerContent = await page.evaluate(() => {
        const footerSelectors = [
          'footer',
          '.footer',
          '#footer',
          '[class*="footer"]',
          '.contact-info',
          '.contact-details'
        ];

        let content = '';
        for (const selector of footerSelectors) {
          const elements = document.querySelectorAll(selector);
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.textContent) {
              content += ' ' + element.textContent;
            }
          }
        }

        return content.trim();
      });

      return footerContent;
    } catch (error) {
      console.error('Error extracting footer content:', error);
      return '';
    }
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
