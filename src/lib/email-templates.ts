export const emailStyles = {
  body: `margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;`,
  container: `margin:0;padding:0;`,
  wrapper: `padding:40px 20px;`,
  content: `max-width:600px;margin:0 auto;`,
  card: `background-color:#ffffff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.1);overflow:hidden;`,
  logo: `display:block;border:0;outline:none;text-decoration:none;`,
  heading: `margin:0 0 20px 0;font-size:24px;font-weight:700;color:#111827;line-height:1.4;`,
  paragraph: `margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#4b5563;`,
  button: `display:inline-block;padding:14px 32px;background-color:#6366f1;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:8px;text-align:center;`,
  footer: `padding:30px 40px;text-align:center;`,
  footerText: `margin:0 0 8px 0;font-size:12px;line-height:1.5;color:#9ca3af;`,
  footerLink: `color:#6366f1;text-decoration:none;`,
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
                    <!-- Footer -->
                    <tr>
                        <td style="${emailStyles.footer}">
                            <p style="${emailStyles.footerText}">
                                נשלח באמצעות <a href="https://rate-it.co.il" style="${emailStyles.footerLink}">Rate-It</a>
                            </p>
                            <p style="margin:0;font-size:12px;line-height:1.5;color:#9ca3af;">
                                © 2024 Rate-It. כל הזכויות שמורות.
                            </p>
                        </td>
                    </tr>
                </table>
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

export function wrapEmailContent(
  content: string,
  includePreheader?: string
): string {
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

export function createSimpleEmailTemplate(
  title: string,
  content: string,
  ctaText?: string,
  ctaUrl?: string
): string {
  const ctaButton =
    ctaText && ctaUrl
      ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
            <td align="center" style="padding:24px 0;">
                <a href="${ctaUrl}" target="_blank" style="${emailStyles.button}">
                    ${ctaText}
                </a>
            </td>
        </tr>
    </table>`
      : "";

  return wrapEmailContent(`
    <!-- Logo Header -->
    <tr>
        <td align="center" style="padding:0 0 30px 0;">
            <img src="https://rate-it.co.il/logo_new.png" alt="Rate-It" width="150" height="28" style="${emailStyles.logo}">
        </td>
    </tr>
    
    <!-- Main Content Card -->
    <tr>
        <td style="${emailStyles.card}">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                    <td style="padding:40px 40px 30px 40px;direction:rtl;text-align:right;">
                        <h1 style="${emailStyles.heading}">
                            ${title}
                        </h1>
                        ${content}
                        ${ctaButton}
                    </td>
                </tr>
            </table>
        </td>
    </tr>`);
}
