(function(){
  'use strict';
  
  const ATTR_WEBSITE_ID = 'data-rateit-website-id';
  const ATTR_TYPE = 'data-rateit-type';
  const ATTR_SRC = 'data-rateit-src';
  const ATTR_WEBSITE_URL = 'data-rateit-website-url';

  const LOGO_URL = 'https://res.cloudinary.com/dwqdhp70e/image/upload/v1754689799/defypsjlegiwhfwqwwzf.png';

  function formatRating(r) { return (Math.round(r * 10) / 10).toFixed(1); }

  function createRateItLogo(size = 24) {
    return `<img src="${LOGO_URL}" alt="Rate-It" style="height:${size}px;width:auto;display:block;object-fit:contain;filter:brightness(1.1) contrast(1.05);background-color:transparent;" loading="lazy" />`;
  }

  function createStars(value, size = 16) {
    const filled = Math.round(value);
    let starsHtml = '<div style="display:inline-flex;gap:1px;">';
    for (let i = 1; i <= 5; i++) {
      const color = i <= filled ? '#f59e0b' : '#e5e7eb';
      const shadow = i <= filled ? '0 1px 2px rgba(245, 158, 11, 0.3)' : 'none';
      starsHtml += `<span style="color:${color};font-size:${size}px;line-height:1;text-shadow:${shadow};">★</span>`;
    }
    starsHtml += '</div>';
    return starsHtml;
  }

  // Existing Card widget remains unchanged
  function createCard(data, websiteUrl) {
    const cardId = 'rateit-card-' + Date.now();
    const inner = `
      <div id="${cardId}" style="display:inline-block;padding:20px;background:linear-gradient(135deg,#ffffff 0%,#f8fafc 100%);border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 4px 16px rgba(124,58,237,0.08),0 2px 8px rgba(0,0,0,0.1);min-width:280px;max-width:320px;color:#1e293b;transition:all .3s ease;cursor:pointer;position:relative;overflow:hidden;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#7c3aed,#ec4899);"></div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;direction:ltr;">
          ${createRateItLogo(24)}
          <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;font-weight:500;">דירוג לקוחות</div>
        </div>
        <div style="margin-bottom:16px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
            <div style="font-size:32px;font-weight:800;color:#7c3aed;line-height:1;">${formatRating(data.averageRating)}</div>
            <div style="flex:1;">${createStars(data.averageRating, 20)}</div>
          </div>
          <div style="font-size:14px;color:#64748b;font-weight:500;">מבוסס על ${data.reviewCount} ביקורות לקוחות</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:linear-gradient(135deg, rgba(124,58,237,.05) 0%, rgba(236,72,153,.05) 100%);border-radius:8px;border:1px solid rgba(124,58,237,.1);">
          <div style="width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);box-shadow:0 0 0 2px rgba(34,197,94,.2);"></div>
          <span style="font-size:12px;color:#16a34a;font-weight:600;">מאומת על ידי Rate-It</span>
        </div>
      </div>
      <script>(function(){const c=document.getElementById('${cardId}');c.addEventListener('mouseenter',function(){this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(124,58,237,0.12),0 4px 12px rgba(0,0,0,0.15)';this.style.background='linear-gradient(135deg,#ffffff 0%,#fefefe 100%)';});c.addEventListener('mouseleave',function(){this.style.transform='translateY(0)';this.style.boxShadow='0 4px 16px rgba(124,58,237,0.08),0 2px 8px rgba(0,0,0,0.1)';this.style.background='linear-gradient(135deg,#ffffff 0%,#f8fafc 100%)';});})();</script>
    `;
    if (websiteUrl) {
      return `<a href="https://www.rate-it.co.il/tool/${websiteUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;color:inherit;">${inner}</a>`;
    }
    return inner;
  }

  // New Simple widget (logo row, brand tiles stars, rating + reviews)
  function createSimple(data, websiteUrl) {
    const id = 'rateit-simple-' + Date.now();
    const filled = Math.round(Number(data.averageRating || 0));
    const exact = Number(data.averageRating || 0);
    const tiles = Array.from({ length: 5 }).map((_, i) => {
      const diff = exact - i; // e.g. for i=3 and exact=4.3 => 1.3
      let bg;
      if (diff >= 0.75) bg = '#494bd6';
      else if (diff >= 0.25) bg = 'linear-gradient(90deg, #e2e8f0 50%, #494bd6 50%)';
      else bg = '#e2e8f0';
      const starColor = '#ffffff';
      return `
      <div style="width:48px;height:48px;border-radius:8px;background:${bg};display:flex;align-items:center;justify-content:center;transition:all .2s ease;">
                 <span style="color:${starColor};font-size:32px;line-height:1;font-weight:bold;">★</span>
      </div>`;
    }).join('');

    const inner = `
      <div id="${id}" style="display:inline-block;padding:16px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.06);min-width:320px;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
          ${createRateItLogo(60)}
        </div>
                 <div style="display:flex;gap:3px;margin-bottom:12px;justify-content:center;">${tiles}</div>
        <div style="display:flex;align-items:center;justify-content:center;gap:10px;font-weight:600;color:#0f172a;">
          <span>${formatRating(data.averageRating)}</span>
          <span style="opacity:.4;">|</span>
          <span>${Number(data.reviewCount || 0)} ביקורות</span>
        </div>
      </div>`;
    if (websiteUrl) {
      return `<a href="https://www.rate-it.co.il/tool/${websiteUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;color:inherit;">${inner}</a>`;
    }
    return inner;
  }

  function render(type, data, websiteUrl) {
    switch ((type || 'card').toLowerCase()) {
      case 'simple':
        return createSimple(data, websiteUrl);
      case 'card':
      default:
        return createCard(data, websiteUrl);
    }
  }

  async function fetchWithHourlyCache(url, cacheKey) {
    try {
      if (typeof Storage !== 'undefined') {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          const hourAgo = Date.now() - (60*60*1000);
          if (parsed.timestamp > hourAgo) return parsed.data;
        }
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      if (typeof Storage !== 'undefined') localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
      return data;
    } catch (e) {
      return { averageRating: 4.5, reviewCount: 0 };
    }
  }

  function init(script) {
    const websiteId = script.getAttribute(ATTR_WEBSITE_ID);
    const type = script.getAttribute(ATTR_TYPE) || 'card';
    const dataSrc = script.getAttribute(ATTR_SRC);
    const websiteUrl = script.getAttribute(ATTR_WEBSITE_URL);
    if (!websiteId || !dataSrc) { console.warn('Rate-It widget: Missing required attributes'); return; }
    const cacheKey = `rateit-${websiteId}-${type}`;
    fetchWithHourlyCache(dataSrc, cacheKey).then(data => {
      const html = render(type, data, websiteUrl);
      script.insertAdjacentHTML('afterend', html);
    }).catch(err => console.warn('Rate-It widget failed to load:', err));
  }

  if (document.currentScript) { init(document.currentScript); }
  else { document.querySelectorAll(`script[${ATTR_WEBSITE_ID}]`).forEach(init); }
})(); 