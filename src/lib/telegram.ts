import { trackEvent, AnalyticsEvents } from "./analytics";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface TelegramMessage {
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
  disable_web_page_preview?: boolean;
}

class TelegramService {
  private botToken: string;
  private chatId: string;

  constructor() {
    this.botToken = TELEGRAM_BOT_TOKEN || '';
    this.chatId = TELEGRAM_CHAT_ID || '';
  }

  private isConfigured(): boolean {
    return !!(this.botToken && this.chatId);
  }

  async sendMessage(message: TelegramMessage): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Telegram service not configured - missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
      return false;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message.text,
          parse_mode: message.parse_mode || 'HTML',
          disable_web_page_preview: message.disable_web_page_preview ?? true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Telegram API error:', errorData);
        return false;
      }

      console.log('Telegram message sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      return false;
    }
  }

  async sendReviewAlert(reviewData: {
    userName: string;
    websiteName: string;
    websiteUrl: string;
    rating: number;
    title: string;
    body: string;
    hasProof: boolean;
  }): Promise<boolean> {
    const stars = '⭐'.repeat(reviewData.rating);
    const proofText = reviewData.hasProof ? '📎 עם הוכחה' : '';
    
    const message = `
🔔 <b>ביקורת חדשה!</b>

👤 <b>מחבר:</b> ${reviewData.userName}
🏢 <b>עסק:</b> ${reviewData.websiteName}
🌐 <b>כתובת:</b> ${reviewData.websiteUrl}
${stars} <b>דירוג:</b> ${reviewData.rating}/5

📝 <b>כותרת:</b> ${reviewData.title}
💬 <b>תוכן:</b> ${reviewData.body.substring(0, 200)}${reviewData.body.length > 200 ? '...' : ''}

${proofText}

🔗 <a href="https://www.rate-it.co.il/tool/${encodeURIComponent(reviewData.websiteUrl)}">צפה בביקורת</a>
    `.trim();

    return this.sendMessage({ text: message, parse_mode: 'HTML' });
  }

  async sendUserSignupAlert(userData: {
    name: string;
    email: string;
    isAgreeMarketing?: boolean;
    signupMethod?: string;
  }): Promise<boolean> {
    const marketingText = userData.isAgreeMarketing ? '✅ הסכים לשיווק' : '❌ לא הסכים לשיווק';
    const methodText = userData.signupMethod ? `📱 ${userData.signupMethod}` : '📧 אימייל';
    
    const message = `
👋 <b>משתמש חדש נרשם!</b>

👤 <b>שם:</b> ${userData.name}
📧 <b>אימייל:</b> ${userData.email}
${methodText}
${marketingText}

🕐 <b>זמן:</b> ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}
    `.trim();

    return this.sendMessage({ text: message, parse_mode: 'HTML' });
  }

  async sendBusinessVerificationAlert(businessData: {
    businessName: string;
    websiteUrl: string;
    workEmail: string;
    fullName: string;
    phoneNumber?: string;
    role?: string;
  }): Promise<boolean> {
    const phoneText = businessData.phoneNumber ? `📞 <b>טלפון:</b> ${businessData.phoneNumber}` : '';
    const roleText = businessData.role ? `💼 <b>תפקיד:</b> ${businessData.role}` : '';
    
    const message = `
🏢 <b>עסק חדש באימות!</b>

🏪 <b>שם העסק:</b> ${businessData.businessName}
🌐 <b>אתר:</b> ${businessData.websiteUrl}
👤 <b>איש קשר:</b> ${businessData.fullName}
📧 <b>אימייל עבודה:</b> ${businessData.workEmail}
${phoneText}
${roleText}

⏰ <b>זמן:</b> ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}

🔗 <a href="https://www.rate-it.co.il/tool/${encodeURIComponent(businessData.websiteUrl)}">צפה בעסק</a>
    `.trim();

    return this.sendMessage({ text: message, parse_mode: 'HTML' });
  }

  async sendBusinessCreatedAlert(businessData: {
    businessName: string;
    websiteUrl: string;
    ownerName: string;
    ownerEmail: string;
    workEmail?: string;
    pricingModel: string;
  }): Promise<boolean> {
    const workEmailText = businessData.workEmail ? `📧 <b>אימייל עבודה:</b> ${businessData.workEmail}` : '';
    
    const message = `
🎉 <b>עסק חדש נוצר בהצלחה!</b>

🏪 <b>שם העסק:</b> ${businessData.businessName}
🌐 <b>אתר:</b> ${businessData.websiteUrl}
👤 <b>בעלים:</b> ${businessData.ownerName}
📧 <b>אימייל בעלים:</b> ${businessData.ownerEmail}
${workEmailText}
💼 <b>תוכנית:</b> ${businessData.pricingModel}

✅ <b>סטטוס:</b> מאומת ופעיל

⏰ <b>זמן:</b> ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}

🔗 <a href="https://www.rate-it.co.il/tool/${encodeURIComponent(businessData.websiteUrl)}">צפה בעסק</a>
    `.trim();

    return this.sendMessage({ text: message, parse_mode: 'HTML' });
  }

  async sendSystemAlert(alertData: {
    type: 'error' | 'warning' | 'info';
    title: string;
    message: string;
    details?: string;
  }): Promise<boolean> {
    const icons = {
      error: '🚨',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const icon = icons[alertData.type];
    const detailsText = alertData.details ? `\n\n<b>פרטים:</b> ${alertData.details}` : '';
    
    const message = `
${icon} <b>${alertData.title}</b>

${alertData.message}${detailsText}

🕐 <b>זמן:</b> ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}
    `.trim();

    return this.sendMessage({ text: message, parse_mode: 'HTML' });
  }
}

export const telegramService = new TelegramService();

// Convenience functions for easy use
export const sendReviewAlert = (reviewData: Parameters<typeof telegramService.sendReviewAlert>[0]) => 
  telegramService.sendReviewAlert(reviewData);

export const sendUserSignupAlert = (userData: Parameters<typeof telegramService.sendUserSignupAlert>[0]) => 
  telegramService.sendUserSignupAlert(userData);

export const sendBusinessVerificationAlert = (businessData: Parameters<typeof telegramService.sendBusinessVerificationAlert>[0]) => 
  telegramService.sendBusinessVerificationAlert(businessData);

export const sendBusinessCreatedAlert = (businessData: Parameters<typeof telegramService.sendBusinessCreatedAlert>[0]) => 
  telegramService.sendBusinessCreatedAlert(businessData);

export const sendSystemAlert = (alertData: Parameters<typeof telegramService.sendSystemAlert>[0]) => 
  telegramService.sendSystemAlert(alertData);
