"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLoginModal } from "@/hooks/use-login-modal";
import { useSession, signOut } from "next-auth/react";
import { UserNav } from "@/components/user-nav";
import { SearchInput } from "@/components/search-input";
import { useRouter, usePathname } from "next/navigation";

const navigation = [
  // { name: "For Businesses", href: "/business" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { data: session } = useSession();
  const loginModal = useLoginModal();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setShowMobileSearch(false);
  };

  const isBusinessHome = pathname === "/business";
  const isBusinessRegister = pathname === "/business/register";

  const isRegularSite = pathname?.includes("/business") !== true;

  const showSearch = pathname !== "/" && isRegularSite;

  const isBusinessDashboard = pathname?.includes("/business/dashboard");

  if (isBusinessDashboard) return <> </>;
  else {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4" aria-label="Main navigation">
          {isBusinessRegister ? (
            <div className="flex h-16 items-center justify-center">
              {/* Only logo for business register page */}
              <Link
                href="/business"
                className="flex items-center hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/logo.svg"
                    alt="AI-Radar"
                    width={150}
                    height={28}
                  />
                  <span className="text-sm font-medium text-muted-foreground border-border/50 mt-[11px]">
                    Business
                  </span>
                </div>
              </Link>
            </div>
          ) : (
            <div className="relative flex h-16 items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0">
                <Link
                  href={pathname?.includes("/business") ? "/business" : "/"}
                  className="flex items-center hover:opacity-90 transition-opacity"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src="/logo.svg"
                      alt="AI-Radar"
                      width={150}
                      height={28}
                    />
                    {pathname?.includes("/business") && (
                      <span className="text-sm font-medium text-muted-foreground border-border/50 mt-[11px]">
                        Business
                      </span>
                    )}
                  </div>
                </Link>
              </div>

              {/* Search Input - Desktop */}
              {showSearch && (
                <div className="hidden md:flex flex-1 max-w-xl">
                  <SearchInput onSearch={handleSearch} variant="header" />
                </div>
              )}

              {/* Desktop Navigation */}

              <div className="hidden md:flex md:items-center md:space-x-8">
                {isRegularSite &&
                  navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  ))}

                {isRegularSite ? (
                  <Link
                    href="/business"
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
                  >
                    For Businesses
                  </Link>
                ) : (
                  <Link
                    href="/"
                    className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Consumer Site
                  </Link>
                )}

                {isBusinessHome && (
                  <Link
                    href="/business/register"
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
                  >
                    Create free account
                  </Link>
                )}

                {/* {session?.user && (
                <Link
                  href="/my-reviews"
                  className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  My Reviews
                </Link>
              )} */}

                {isRegularSite && (
                  <div className="flex items-center gap-2">
                    {session?.user ? (
                      <UserNav
                        user={session.user}
                        onSignOut={() => signOut()}
                      />
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => loginModal.onOpen()}
                        className="font-medium"
                      >
                        Login
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-2 md:hidden">
                {/* Search Icon */}
                {showSearch && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10"
                    onClick={() => setShowMobileSearch(!showMobileSearch)}
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                )}

                {/* Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                  {isOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Search Bar */}
          {!isBusinessRegister && showSearch && showMobileSearch && (
            <div className="md:hidden py-2 px-1">
              <SearchInput onSearch={handleSearch} variant="header" />
            </div>
          )}

          {/* Mobile Navigation */}
          {!isBusinessRegister && (
            <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
              <div className="space-y-1 pb-3">
                {isRegularSite &&
                  navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block rounded-md px-3 py-4 text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                {isRegularSite ? (
                  <Link
                    href="/business"
                    className="block rounded-md px-3 py-4 text-base font-medium text-primary hover:bg-muted/50 hover:text-primary/80 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    For Businesses
                  </Link>
                ) : (
                  <Link
                    href="/"
                    className="block rounded-md px-3 py-4 text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Consumer Site
                  </Link>
                )}

                {isBusinessHome && (
                  <Link
                    href="/business/register"
                    className="block rounded-md px-3 py-4 text-base font-medium text-primary hover:bg-muted/50 hover:text-primary/80 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Create free account
                  </Link>
                )}

                {session?.user && (
                  <Link
                    href="/my-reviews"
                    className="block rounded-md px-3 py-4 text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    My Reviews
                  </Link>
                )}

                {isRegularSite && (
                  <div className="px-3 py-4">
                    {session?.user ? (
                      <UserNav
                        user={session.user}
                        onSignOut={() => signOut()}
                      />
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setIsOpen(false);
                          loginModal.onOpen();
                        }}
                        className="px-0 w-full justify-start text-base font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                      >
                        Login
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>
    );
  }
}
