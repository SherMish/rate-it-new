"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLoginModal } from "@/hooks/use-login-modal";
import { useSession, signOut } from "next-auth/react";
import { UserNav } from "@/components/user-nav";
import { SearchInput } from "@/components/search-input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/contexts/loading-context";

const navigation = [
  // { name: "For Businesses", href: "/business" },
  { name: "אודות", href: "/about" },
];

const businessNavigation = [
  { name: "בלוג", href: "/business/blog" },
  { name: "מסלולים", href: "/business/pricing" },
  { name: "אודות", href: "/about" },
];

// Component to handle search params logic that requires Suspense
function SearchParamsHandler({ 
  pathname, 
  onHeaderTypeChange 
}: { 
  pathname: string; 
  onHeaderTypeChange: (isMini: boolean) => void; 
}) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const isBusinessPricingMini = pathname === "/business/pricing" && searchParams?.get("from") === "dashboard";
    onHeaderTypeChange(isBusinessPricingMini);
  }, [pathname, searchParams, onHeaderTypeChange]);
  
  return null;
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMiniHeader, setIsMiniHeader] = useState(false);
  const { data: session } = useSession();
  const loginModal = useLoginModal();
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading, stopLoading } = useLoading();

  // Handle post-login redirects
  useEffect(() => {
    if (session?.user && loginModal.postLoginAction === "checkBusinessAccess") {
      if (session.user.isWebsiteOwner) {
        window.open("/business/dashboard", "_blank");
      } else {
        window.open("/business/register", "_blank");
      }
      loginModal.setPostLoginAction(null);
    }
  }, [session, loginModal.postLoginAction]);

  const handleBusinessAccess = () => {
    if (!session?.user) {
      loginModal.setPostLoginAction("checkBusinessAccess");
      loginModal.onOpen();
    } else if (!session.user.isWebsiteOwner) {
      window.open("/business/register", "_blank");
    } else {
      window.open("/business/dashboard", "_blank");
    }
  };

  const handleBusinessNavigation = async () => {
    startLoading();

    // Add a small delay to show the progress bar
    await new Promise((resolve) => setTimeout(resolve, 100));

    router.push("/business");

    // Stop loading after a delay (the page will change anyway)
    setTimeout(() => {
      stopLoading();
    }, 1500);
  };

  const handleConsumerNavigation = async () => {
    startLoading();

    // Add a small delay to show the progress bar
    await new Promise((resolve) => setTimeout(resolve, 100));

    router.push("/");

    // Stop loading after a delay (the page will change anyway)
    setTimeout(() => {
      stopLoading();
    }, 1500);
  };

  const handleBusinessNavigationMobile = async () => {
    setIsOpen(false);
    await handleBusinessNavigation();
  };

  const handleConsumerNavigationMobile = async () => {
    setIsOpen(false);
    await handleConsumerNavigation();
  };

  const handleSearch = async (query: string) => {
    startLoading();

    // Add a small delay to show the progress bar
    await new Promise((resolve) => setTimeout(resolve, 100));

    router.push(`/search?q=${encodeURIComponent(query)}`);
    setShowMobileSearch(false);

    // Stop loading after a delay (the page will change anyway)
    setTimeout(() => {
      stopLoading();
    }, 1500);
  };

  const isBusinessHome = pathname === "/business";
  const isBusinessRegister = pathname === "/business/register";
  const isBusinessUpgrade = pathname?.startsWith("/business/upgrade");
  // isMiniHeader is managed by state now
  const isBusinessDashboard = pathname?.includes("/business/dashboard");

  const isRegularSite = pathname?.includes("/business") !== true;
  const isBusinessSection =
    pathname?.includes("/business") === true &&
    !isBusinessDashboard &&
    !isMiniHeader;

  const showSearch = pathname !== "/" && isRegularSite;

  // Update mini header state based on search params
  useEffect(() => {
    const isBusinessRegister = pathname === "/business/register";
    const isBusinessUpgrade = pathname?.startsWith("/business/upgrade") || false;
    setIsMiniHeader(isBusinessRegister || isBusinessUpgrade);
  }, [pathname]);

  if (isBusinessDashboard) return <> </>;
  else {
    return (
      <>
        <Suspense fallback={null}>
          <SearchParamsHandler 
            pathname={pathname || ""} 
            onHeaderTypeChange={(isMini: boolean) => {
              const isBusinessRegister = pathname === "/business/register";
              const isBusinessUpgrade = pathname?.startsWith("/business/upgrade") || false;
              setIsMiniHeader(isBusinessRegister || isBusinessUpgrade || isMini);
            }} 
          />
        </Suspense>
        <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <nav className="container mx-auto px-4" aria-label="ניווט ראשי">
          {isMiniHeader ? (
            <div className="flex h-20 items-center justify-center py-4">
              {/* Only logo for mini header pages */}
              <Link
                href="/business"
                className="flex items-center hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/logo_new.svg"
                    alt="AI-Radar"
                    width={150}
                    height={28}
                  />
                  <span className="text-sm font-medium text-muted-foreground border-border/50 mt-[11px]">
                    לעסקים
                  </span>
                </div>
              </Link>
            </div>
          ) : (
            <div className="relative flex h-16 items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0 order-1">
                <Link
                  href={pathname?.includes("/business") ? "/business" : "/"}
                  className="flex items-center hover:opacity-90 transition-opacity"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src="/logo_new.svg"
                      alt="AI-Radar"
                      width={150}
                      height={28}
                    />
                    {pathname?.includes("/business") && (
                      <span className="text-sm font-medium text-muted-foreground border-border/50 mt-[11px]">
                        לעסקים
                      </span>
                    )}
                  </div>
                </Link>
              </div>

              {/* Search Input - Desktop */}
              {showSearch && (
                <div className="hidden md:flex flex-1 max-w-xl order-2">
                  <SearchInput onSearch={handleSearch} variant="header" />
                </div>
              )}

              {/* Desktop Navigation */}

              <div className="hidden md:flex md:items-center md:space-x-0 md:space-x-reverse md:space-y-0 md:mr-8 order-3 gap-4">
                {isRegularSite &&
                  navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground mr-8"
                    >
                      {item.name}
                    </Link>
                  ))}
                {!isRegularSite &&
                  businessNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground mr-8"
                    >
                      {item.name}
                    </Link>
                  ))}

                {isRegularSite ? (
                  <button
                    onClick={handleBusinessNavigation}
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
                  >
                    כניסה לעסקים
                  </button>
                ) : (
                  <button
                    onClick={handleConsumerNavigation}
                    className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    אתר צרכנים
                  </button>
                )}

                {isBusinessSection && (
                  <>
                    <Button
                      onClick={handleBusinessAccess}
                      className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-primary bg-white border border-primary rounded-full hover:bg-primary/5 transition-colors shadow-sm hover:shadow-md mr-4"
                    >
                      כניסה לרשומים
                    </Button>
                    <Link
                      href="/business/register"
                      className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md mr-4"
                    >
                      צור חשבון חינם
                    </Link>
                  </>
                )}

                {isRegularSite && (
                  <div className="flex items-center gap-2 mr-4">
                    {session?.user ? (
                      <UserNav
                        user={session.user}
                        onSignOut={() => signOut()}
                      />
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => loginModal.onOpen()}
                        className="font-medium bg-white border border-border hover:bg-blue-50"
                      >
                        התחברות
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-2 md:hidden order-2">
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
                  aria-label={isOpen ? "סגור תפריט" : "פתח תפריט"}
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
          {!isMiniHeader && showSearch && showMobileSearch && (
            <div className="md:hidden py-2 px-1">
              <SearchInput onSearch={handleSearch} variant="header" />
            </div>
          )}

          {/* Mobile Navigation */}
          {!isMiniHeader && (
            <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
              <div className="space-y-1 pb-3 text-right bg-white">
                {isRegularSite &&
                  navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block rounded-md px-3 py-4 text-base font-medium text-muted-foreground hover:bg-blue-50 hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                {/* Business Section - Custom Order */}
                {isBusinessSection && (
                  <>
                    <Link
                      href="/business/register"
                      className="block rounded-md px-3 py-4 text-base font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      צור חשבון חינם
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleBusinessAccess();
                      }}
                      className="block rounded-md px-3 py-4 text-base font-medium text-primary hover:bg-blue-50 hover:text-primary/80 transition-colors w-full text-right"
                    >
                      כניסה לרשומים
                    </button>
                    {businessNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block rounded-md px-3 py-4 text-base font-medium text-muted-foreground hover:bg-blue-50 hover:text-foreground transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={handleConsumerNavigationMobile}
                      className="block rounded-md px-3 py-4 text-base font-medium text-muted-foreground hover:bg-blue-50 hover:text-foreground transition-colors"
                    >
                      אתר צרכנים
                    </button>
                  </>
                )}

                {isRegularSite && (
                  <button
                    onClick={handleBusinessNavigationMobile}
                    className="block rounded-md px-3 py-4 text-base font-medium text-primary hover:bg-blue-50 hover:text-primary/80 transition-colors"
                  >
                    כניסה לעסקים
                  </button>
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
                        className="px-0 w-full justify-start text-base font-medium text-muted-foreground hover:bg-blue-50 hover:text-foreground transition-colors"
                      >
                        התחברות
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>
      </>
    );
  }
}
