export const emailStyles = {
  body: `margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;`,
  container: `margin:0;padding:0;`,
  wrapper: `padding:20px;`,
  content: `max-width:600px;margin:0 auto;`,
  logoSection: `background-color:#6366f1;padding:30px 20px;text-align:center;border-radius:12px 12px 0 0;`,
  card: `background-color:#ffffff;border-radius:0 0 12px 12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);overflow:hidden;`,
  logo: `display:block;border:0;outline:none;text-decoration:none;border-radius:12px;margin-left:auto;margin-right:auto`,
  heading: `margin:0 0 20px 0;font-size:28px;font-weight:700;color:#111827;line-height:1.3;`,
  subheading: `margin:0 0 16px 0;font-size:20px;font-weight:600;color:#374151;line-height:1.4;`,
  paragraph: `margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#4b5563;`,
  smallText: `margin:0 0 16px 0;font-size:14px;line-height:1.5;color:#6b7280;`,
  button: `display:inline-block;padding:16px 32px;background-color:#6366f1;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:8px;text-align:center;box-shadow:0 2px 4px rgba(99,102,241,0.3);`,
  buttonSection: `text-align:center;padding:24px 0;`,
  footer: `padding:30px 40px;text-align:center;background-color:#f9fafb;border-top:1px solid #e5e7eb;`,
  footerText: `margin:0 0 8px 0;font-size:12px;line-height:1.5;color:#9ca3af;`,
  footerLink: `color:#6366f1;text-decoration:none;`,
  infoBox: `background-color:#f0f9ff;border:1px solid #0ea5e9;border-radius:8px;padding:16px;margin:20px 0;`,
  warningBox: `background-color:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:16px;margin:20px 0;`,
  errorBox: `background-color:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:16px;margin:20px 0;`,
};

export function getEmailHeader(): string {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Rate-It</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="${emailStyles.body}">`;
}

export function getEmailFooter(): string {
  return `
                        </tr>
                    </table>
                    
                    <!-- Footer -->
                    <div style="${emailStyles.footer}">
                        <p style="${emailStyles.footerText}">
                            נשלח באמצעות <a href="https://rate-it.co.il" style="${emailStyles.footerLink}">Rate-It</a>
                        </p>
                        <p style="margin:0;font-size:12px;line-height:1.5;color:#9ca3af;">
                            © 2024 Rate-It. כל הזכויות שמורות.
                        </p>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

export function getPlainTextFooter(): string {
  return `

--
נשלח באמצעות Rate-It
© 2024 Rate-It. כל הזכויות שמורות.
https://rate-it.co.il`;
}

interface EmailData {
  subject: string;
  title: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  preheader?: string;
  additionalContent?: string;
}

export function createUnifiedEmailTemplate({
  subject,
  title,
  body,
  ctaText,
  ctaUrl,
  preheader,
  additionalContent,
}: EmailData): { html: string; text: string } {
  const ctaButton =
    ctaText && ctaUrl
      ? `
    <div style="${emailStyles.buttonSection}">
        <a href="${ctaUrl}" target="_blank" style="${emailStyles.button}">
            ${ctaText}
        </a>
    </div>`
      : "";

  const preheaderText = preheader
    ? `
    <div style="display:none;font-size:1px;color:#f3f4f6;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
        ${preheader}
    </div>`
    : "";

  const html = `${getEmailHeader()}
    ${preheaderText}
    
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="${
      emailStyles.container
    }">
        <tr>
            <td align="center" style="${emailStyles.wrapper}">
                <div style="${emailStyles.content}">
                    <!-- Logo Section -->
                    <div style="${emailStyles.logoSection}">
                        <img src="https://rate-it.co.il/logo_new.png" alt="Rate-It" width="240" height="120" style="${
                          emailStyles.logo
                        }">
                    </div>
                    
                    <!-- Main Content -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="${
                      emailStyles.card
                    }">
                        <tr>
                            <td style="padding:40px 40px 30px 40px;direction:rtl;text-align:right;">
                                <h1 style="${emailStyles.heading}">
                                    ${title}
                                </h1>
                                
                                <div style="${emailStyles.paragraph}">
                                    ${body}
                                </div>
                                
                                ${additionalContent || ""}
                                ${ctaButton}
                            </td>
                        </tr>
                    </table>
                    
                    <!-- Footer -->
                    ${getEmailFooter()}`;

  const text = `${title}

${body
  .replace(/<[^>]*>/g, "")
  .replace(/\s+/g, " ")
  .trim()}

${ctaText && ctaUrl ? `${ctaText}: ${ctaUrl}` : ""}${getPlainTextFooter()}`;

  return { html, text };
}

// Legacy function for backward compatibility
export function createSimpleEmailTemplate(
  title: string,
  content: string,
  ctaText?: string,
  ctaUrl?: string
): string {
  return createUnifiedEmailTemplate({
    subject: title,
    title,
    body: content,
    ctaText,
    ctaUrl,
  }).html;
}

export function wrapEmailContent(
  content: string,
  includePreheader?: string
): string {
  // This function is kept for backward compatibility but should be migrated to createUnifiedEmailTemplate
  const preheader = includePreheader
    ? `<div style="display:none;font-size:1px;color:#f3f4f6;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${includePreheader}</div>`
    : "";

  return `${getEmailHeader()}
    ${preheader}
    
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="${
      emailStyles.container
    }">
        <tr>
            <td align="center" style="${emailStyles.wrapper}">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="${
                  emailStyles.content
                }">
                    ${content}
                    ${getEmailFooter()}`;
}
