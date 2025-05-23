"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart2,
  MessageSquare,
  Settings,
  Users,
  ArrowRight,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { UserNav } from "@/components/user-nav";
import BusinessTabHighlight from "@/app/components/BusinessTabHighlight";

const menuItems = [
  {
    title: "סקירה כללית",
    href: "/business/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "ביקורות",
    href: "/business/dashboard/reviews",
    icon: MessageSquare,
  },
  {
    title: "מחולל הביקורות",
    href: "/business/dashboard/reviews-generator",
    icon: Users,
  },
  {
    title: "דף העסק",
    href: "/business/dashboard/tool",
    icon: FileText,
    highlight: true,
  },
  {
    title: "הגדרות",
    href: "/business/dashboard/settings",
    icon: Settings,
  },
];

export function SideNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Check if we should highlight the business tab
  const isFirstTime = searchParams?.get("firstTime") === "true";

  return (
    <nav className="sticky top-0 h-[100vh] w-64 border-r border-border bg-background z-40 flex flex-col">
      <div className="flex-grow overflow-y-auto">
        <div className="p-6">
          <Link
            href="/business"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/logo_new.svg"
                alt="Rate It"
                width={150}
                height={28}
              />
              <span className="text-sm font-medium text-gray-400 border-border/50 mt-[11px]">
                עסקים
              </span>
            </div>
          </Link>
        </div>
        <div className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Determine if this item should be highlighted
            const shouldHighlight = isFirstTime && item.highlight;

            const menuItemElement = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-primary/10",
                  pathname === item.href
                    ? "bg-gradient-to-r from-primary to-purple-600 text-white font-medium shadow-lg shadow-primary/20"
                    : "text-foreground hover:text-primary"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    pathname === item.href
                      ? "text-white"
                      : "text-muted-foreground"
                  )}
                />
                {item.title}
              </Link>
            );

            return shouldHighlight ? (
              <BusinessTabHighlight key={item.href}>
                {menuItemElement}
              </BusinessTabHighlight>
            ) : (
              menuItemElement
            );
          })}
        </div>
      </div>

      {/* Upgrade to Plus CTA - Placed before User Profile */}
      <div className="px-4 pt-4 pb-2 mt-auto border-t border-border">
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 via-purple-600/10 to-pink-500/10 border border-primary/20 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <BadgeCheck className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">
              שדרגו לפלוס
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            קבלו תג מאומת, אנליטיקות מתקדמות ועוד כלים שיעזרו לכם להגדיל המרות.
          </p>
          <Link
            href="/business/pricing"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white rounded-md px-3 py-2 text-xs font-medium hover:opacity-90 transition-opacity shadow-sm hover:shadow-lg"
          >
            צפו במסלולים
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* User Profile at Bottom */}
      {session?.user && (
        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session.user.email}
              </p>
            </div>
            <UserNav user={session.user} onSignOut={() => signOut()} />
          </div>
        </div>
      )}
    </nav>
  );
}
