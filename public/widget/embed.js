(function(){
  'use strict';
  
  const ATTR_WEBSITE_ID = 'data-rateit-website-id';
  const ATTR_TYPE = 'data-rateit-type';
  const ATTR_SRC = 'data-rateit-src';

  // Rate-It logo from Cloudinary
  const LOGO_URL = 'https://res.cloudinary.com/dwqdhp70e/image/upload/v1754689799/defypsjlegiwhfwqwwzf.png';

  function formatRating(r) {
    return (Math.round(r * 10) / 10).toFixed(1);
  }

  function createRateItLogo(size = 24, showText = false) {
    // Using the actual Rate-It logo with proper scaling
    const logoHtml = `
      <img 
        src="${LOGO_URL}" 
        alt="Rate-It" 
        style="
          height: ${size}px; 
          width: auto; 
          display: block;
          object-fit: contain;
          filter: brightness(1.1) contrast(1.05);
          background-color: transparent;
        "
        loading="lazy"
      />
    `;
    
    if (showText) {
      return `
        <div style="display: inline-flex; align-items: center; gap: 8px;">
          ${logoHtml}
          <span style="
            font-weight: 700;
            font-size: ${Math.max(12, size * 0.5)}px;
            color: #334155;
            letter-spacing: 0.5px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ">Rate·It</span>
        </div>
      `;
    }
    
    return logoHtml;
  }

  function createStars(value, size = 16) {
    const filled = Math.round(value);
    let starsHtml = '<div style="display: inline-flex; gap: 1px;">';
    for (let i = 1; i <= 5; i++) {
      const color = i <= filled ? '#f59e0b' : '#e5e7eb';
      const shadow = i <= filled ? '0 1px 2px rgba(245, 158, 11, 0.3)' : 'none';
      starsHtml += `<span style="color: ${color}; font-size: ${size}px; line-height: 1; text-shadow: ${shadow};">★</span>`;
    }
    starsHtml += '</div>';
    return starsHtml;
  }

  function createCard(data) {
    const cardId = 'rateit-card-' + Date.now();
    return `
      <div id="${cardId}" style="
        display: inline-block;
        padding: 20px;
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        box-shadow: 0 4px 16px rgba(124, 58, 237, 0.08), 0 2px 8px rgba(0, 0, 0, 0.1);
        min-width: 280px;
        max-width: 320px;
        color: #1e293b;
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        text-decoration: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <!-- Purple accent -->
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #7c3aed, #ec4899);"></div>
        
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          ${createRateItLogo(32, true)}
          <div style="font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">
            דירוג לקוחות
          </div>
        </div>

        <!-- Rating section -->
        <div style="margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <div style="font-size: 32px; font-weight: 800; color: #7c3aed; line-height: 1;">
              ${formatRating(data.averageRating)}
            </div>
            <div style="flex: 1;">
              ${createStars(data.averageRating, 20)}
              <div style="font-size: 13px; color: #64748b; margin-top: 2px;">
                מתוך 5 כוכבים
              </div>
            </div>
          </div>
          
          <div style="font-size: 14px; color: #64748b; font-weight: 500;">
            מבוסס על ${data.reviewCount} ביקורות לקוחות
          </div>
        </div>

        <!-- Trust indicator -->
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
          border-radius: 8px;
          border: 1px solid rgba(124, 58, 237, 0.1);
        ">
          <div style="
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
          "></div>
          <span style="font-size: 12px; color: #16a34a; font-weight: 600;">
            מאומת על ידי Rate-It
          </span>
        </div>
      </div>
      <script>
        (function() {
          const card = document.getElementById('${cardId}');
          card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.12), 0 4px 12px rgba(0, 0, 0, 0.15)';
            this.style.background = 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)';
          });
          card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 16px rgba(124, 58, 237, 0.08), 0 2px 8px rgba(0, 0, 0, 0.1)';
            this.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
          });
        })();
      </script>
    `;
  }

  function render(type, data) {
    // Only support card widget now
    return createCard(data);
  }

  async function fetchWithHourlyCache(url, cacheKey) {
    try {
      // Check localStorage cache
      if (typeof Storage !== 'undefined') {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          const hourAgo = Date.now() - (60 * 60 * 1000); // 1 hour
          if (parsed.timestamp > hourAgo) {
            return parsed.data;
          }
        }
      }

      // Fetch fresh data
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();

      // Cache the result
      if (typeof Storage !== 'undefined') {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: data,
          timestamp: Date.now()
        }));
      }

      return data;
    } catch (error) {
      // Return fallback data
      return { averageRating: 4.5, reviewCount: 0 };
    }
  }

  function init(script) {
    const websiteId = script.getAttribute(ATTR_WEBSITE_ID);
    const type = script.getAttribute(ATTR_TYPE) || 'card';
    const dataSrc = script.getAttribute(ATTR_SRC);

    if (!websiteId || !dataSrc) {
      console.warn('Rate-It widget: Missing required attributes');
      return;
    }

    const cacheKey = `rateit-${websiteId}-${type}`;

    fetchWithHourlyCache(dataSrc, cacheKey).then(data => {
      const widgetHtml = render(type, data);
      script.insertAdjacentHTML('afterend', widgetHtml);
    }).catch(error => {
      console.warn('Rate-It widget failed to load:', error);
    });
  }

  // Initialize all widgets
  if (document.currentScript) {
    init(document.currentScript);
  } else {
    // Fallback for older browsers
    const scripts = document.querySelectorAll(`script[${ATTR_WEBSITE_ID}]`);
    scripts.forEach(init);
  }
})(); 