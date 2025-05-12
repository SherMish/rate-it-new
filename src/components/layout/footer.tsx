import Link from "next/link";
import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6";

const navigation = {
  main: [
    { name: "אודות", href: "/about" },
    { name: "בלוג", href: "/blog" },
    { name: "לעסקים", href: "/business" },
    // { name: "Contact", href: "/contact" },
  ],
  social: [
    {
      name: "X",
      href: "https://x.com/_AIRadar",
      icon: FaXTwitter,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/airadaris",
      icon: FaLinkedin,
    },
  ],
};

export function Footer() {
  return (
    <footer className="bg-secondary/50 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 text-right">
            <Link href="/" className="text-xl font-bold gradient-text">
              AI-Radar
            </Link>
            <p className="text-sm text-muted-foreground">
              גלה ושתף תובנות על כלי הבינה המלאכותית הטובים ביותר. המקור האמין
              שלך לביקורות והמלצות על כלי בינה מלאכותית.
            </p>
          </div>

          {/* Navigation */}
          <div className="text-right">
            <h3 className="text-sm font-semibold mb-4">ניווט</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-right">
            <h3 className="text-sm font-semibold mb-4">יצירת קשר</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>אימייל: info@ai-radar.co</li>
              {/* <li>Support: support@ai-radar.com</li> */}
            </ul>
          </div>

          {/* Social */}
          <div className="text-right">
            <h3 className="text-sm font-semibold mb-4">עקבו אחרינו</h3>
            <div className="flex space-x-4 space-x-reverse rtl:space-x-reverse">
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 md:flex md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground text-right md:text-right">
            &copy; {new Date().getFullYear()} AI-Radar. כל הזכויות שמורות.
          </p>
          <div className="mt-4 flex space-x-6 space-x-reverse rtl:space-x-reverse md:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              מדיניות פרטיות
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              תנאי שימוש
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
