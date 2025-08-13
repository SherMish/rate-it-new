import Link from "next/link";
import Image from "next/image";
import {
  FaGithub,
  FaXTwitter,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaTiktok,
} from "react-icons/fa6";

const navigation = {
  main: [
    { name: "אודות", href: "/about" },
    { name: "לעסקים", href: "/business" },
    // { name: "Contact", href: "/contact" },
  ],
  social: [
    {
      name: "Instagram",
      href: "https://www.instagram.com/rate_it_il?igsh=MWowMmx0bm9sNzVyOA%3D%3D&utm_source=qr",
      icon: FaInstagram,
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/share/19aaBgpYmr/?mibextid=wwXIfr",
      icon: FaFacebook,
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@rate_it_il?_t=ZS-8x0LixEwE6i&_r=1",
      icon: FaTiktok,
    },
  ],
};

export function Footer() {
  return (
    <footer className="bg-blue-50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 text-right">
            <Link
              href="/"
              className="block hover:opacity-90 transition-opacity"
            >
              <Image
                src="/logo_new.svg"
                alt="AI-Radar"
                width={150}
                height={28}
              />
            </Link>
            <p className="text-sm text-muted-foreground">
בדקו מה לקוחות אמיתיים חושבים לפני שאתם קונים באינטרנט
            </p>
          </div>

          {/* Navigation */}
          <div className="text-right">
            <h3 className="text-sm font-semibold mb-4 text-foreground">
              ניווט
            </h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-right">
            <h3 className="text-sm font-semibold mb-4 text-foreground">
              יצירת קשר
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>אימייל: hello@rate-it.co.il</li>
            </ul>
          </div>

          {/* Social */}
          <div className="text-right">
            <h3 className="text-sm font-semibold mb-4 text-foreground">
              עקבו אחרינו
            </h3>
            <div className="flex space-x-4 space-x-reverse rtl:space-x-reverse">
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
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
            &copy; {new Date().getFullYear()} Rate-it. כל הזכויות שמורות.
          </p>
          <div className="mt-4 flex space-x-6 space-x-reverse rtl:space-x-reverse md:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              מדיניות פרטיות
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              תנאי שימוש
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
