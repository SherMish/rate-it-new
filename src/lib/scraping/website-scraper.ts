import puppeteer, { Browser, Page } from 'puppeteer';

export interface ScrapedContent {
  mainPage: {
    title: string;
    description: string;
    content: string;
    links: string[];
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

      // Scrape main page
      const mainPage = await this.scrapeMainPage(page, normalizedUrl);
      
      // Find and scrape about page
      const aboutPage = await this.findAndScrapeAboutPage(page, normalizedUrl, mainPage.links);
      
      // Find and scrape contact page
      const contactPage = await this.findAndScrapeContactPage(page, normalizedUrl, mainPage.links);

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
    await page.goto(url, { waitUntil: 'networkidle2' });

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

      // Extract all links
      const links: string[] = [];
      document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          links.push(href);
        }
      });

      return {
        title: title.trim(),
        description: description.trim(),
        content: content.trim().substring(0, 5000), // Limit content size
        links: Array.from(new Set(links)) // Remove duplicates
      };
    });

    return result;
  }

  private async findAndScrapeAboutPage(page: Page, baseUrl: string, links: string[]): Promise<{ content: string; url: string } | undefined> {
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

    const aboutLink = this.findPageByPatterns(links, aboutPatterns, baseUrl);
    if (!aboutLink) return undefined;

    try {
      await page.goto(aboutLink, { waitUntil: 'networkidle2' });
      
      const content = await page.evaluate(() => {
        const contentSelectors = ['main', '[role="main"]', '.content', '#content', 'body'];
        
        for (const selector of contentSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            const cloned = element.cloneNode(true) as Element;
            const unwanted = cloned.querySelectorAll('script, style, nav, header, footer');
            unwanted.forEach(el => el.remove());
            
            const text = cloned.textContent || '';
            if (text.length > 100) return text.trim().substring(0, 3000);
          }
        }
        return '';
      });

      return { content, url: aboutLink };
    } catch (error) {
      console.error('Error scraping about page:', error);
      return undefined;
    }
  }

  private async findAndScrapeContactPage(page: Page, baseUrl: string, links: string[]): Promise<{ content: string; url: string } | undefined> {
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

    const contactLink = this.findPageByPatterns(links, contactPatterns, baseUrl);
    if (!contactLink) return undefined;

    try {
      await page.goto(contactLink, { waitUntil: 'networkidle2' });
      
      const content = await page.evaluate(() => {
        const contentSelectors = ['main', '[role="main"]', '.content', '#content', 'body'];
        
        for (const selector of contentSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            const cloned = element.cloneNode(true) as Element;
            const unwanted = cloned.querySelectorAll('script, style, nav, header, footer');
            unwanted.forEach(el => el.remove());
            
            const text = cloned.textContent || '';
            if (text.length > 50) return text.trim().substring(0, 2000);
          }
        }
        return '';
      });

      return { content, url: contactLink };
    } catch (error) {
      console.error('Error scraping contact page:', error);
      return undefined;
    }
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
