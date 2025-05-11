"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart2,
  MessageSquare,
  Settings,
  Users,
  ArrowRight,
  FileText,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { UserNav } from "@/components/user-nav";

const menuItems = [
  {
    title: "Overview",
    href: "/business/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reviews",
    href: "/business/dashboard/reviews",
    icon: MessageSquare,
  },
  {
    title: "Reviews Generator",
    href: "/business/dashboard/reviews-generator",
    icon: Users,
  },
  {
    title: "Tool Page",
    href: "/business/dashboard/tool",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/business/dashboard/settings",
    icon: Settings,
  },
];

export function SideNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 h-[100vh] w-64 border-r border-white/[0.08] bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30 z-40">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Link
            href="/business"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="AI-Radar" width={150} height={28} />
              <span className="text-sm font-medium text-gray-400 border-border/50 mt-[11px]">
                Business
              </span>
            </div>
          </Link>
        </div>
        <div className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-white/[0.06]",
                  pathname === item.href
                    ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-medium shadow-lg shadow-purple-500/20"
                    : "text-gray-400 hover:text-gray-200"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    pathname === item.href ? "text-white" : "text-gray-400"
                  )}
                />
                {item.title}
              </Link>
            );
          })}
        </div>
        {/* <div className="p-4 mx-3 mt-6 rounded-lg bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 border border-purple-500/20">
          <h3 className="font-medium text-white mb-1">Upgrade to Pro</h3>
          <p className="text-sm text-gray-400 mb-3">Get advanced analytics and premium features</p>
          <Link
            href="/business/pricing"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-md px-3 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Upgrade Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div> */}
        <div className="flex-1" />

        {/* User Profile at Bottom */}
        {session?.user && (
          <div className="px-3 py-4 mt-auto border-t border-white/[0.08]">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-300 truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user.email}
                </p>
              </div>
              <UserNav user={session.user} onSignOut={() => signOut()} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
