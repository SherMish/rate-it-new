"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { WebsiteType } from "@/lib/models/Website";
import { WebsiteCard } from "./website-card";
import { AddToolDialog } from "./add-tool-dialog";
import { AddBlogPostDialog } from "./add-blog-post-dialog";
import { BlogPost } from "@/lib/types/blog";
import { BlogPostCard } from "./blog-post-card";
import { UserManagement } from "./user-management";

const ITEMS_PER_PAGE = 10;

export function AdminDashboard() {
  const router = useRouter();
  const hasRunGuard = useRef(false);

  const { data: session, status } = useSession();
  const [websites, setWebsites] = useState<WebsiteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddToolOpen, setIsAddToolOpen] = useState(false);
  const [isAddBlogPostOpen, setIsAddBlogPostOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tools" | "blogs" | "users">(
    "tools"
  );
  const [toolsPage, setToolsPage] = useState(1);
  const [blogsPage, setBlogsPage] = useState(1);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [totalTools, setTotalTools] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [isLoadingTools, setIsLoadingTools] = useState(true);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [allWebsites, setAllWebsites] = useState<WebsiteType[]>([]);

  const fetchWebsites = useCallback(async () => {
    setIsLoadingTools(true);
    try {
      const response = await fetch(
        `/api/admin/websites?page=${toolsPage}&limit=${ITEMS_PER_PAGE}`
      );
      const data = await response.json();
      setWebsites(data.websites);
      setTotalTools(data.total);
    } catch (error) {
      console.error("Error fetching websites:", error);
    } finally {
      setIsLoadingTools(false);
    }
  }, [toolsPage]);

  const fetchBlogPosts = useCallback(async () => {
    setIsLoadingBlogs(true);
    try {
      const response = await fetch(
        `/api/admin/blog-posts?page=${blogsPage}&limit=${ITEMS_PER_PAGE}`
      );
      const data = await response.json();
      setBlogPosts(data.posts);
      setTotalBlogs(data.total);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setIsLoadingBlogs(false);
    }
  }, [blogsPage]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (hasRunGuard.current) return;

    hasRunGuard.current = true;

    const adminEmails = [
      "sharon.mishayev@gmail.com",
      "liamrose1220@gmail.com",
      "ed123@gmail.com",
    ];
    const userEmail = session?.user?.email;

    if (!userEmail || !adminEmails.includes(userEmail)) {
      router.push("/");
      return;
    }

    if (activeTab === "tools") {
      fetchWebsites();
    } else if (activeTab === "blogs") {
      fetchBlogPosts();
    }
  }, [status, session, activeTab, router, fetchWebsites, fetchBlogPosts]);

  const fetchAllWebsites = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/websites?limit=1000`);
      const data = await response.json();
      setAllWebsites(data.websites);
    } catch (error) {
      console.error("Error fetching all websites:", error);
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      fetchAllWebsites();
    } else {
      fetchWebsites();
    }
  }, [searchQuery, fetchAllWebsites, fetchWebsites]);

  // Fetch blog posts when page changes
  useEffect(() => {
    if (activeTab === "blogs") {
      fetchBlogPosts();
    }
  }, [blogsPage, activeTab, fetchBlogPosts]);

  // Fetch tools when page changes
  useEffect(() => {
    if (activeTab === "tools") {
      fetchWebsites();
    }
  }, [toolsPage, activeTab, fetchWebsites]);

  const maxToolsPages = Math.ceil(totalTools / ITEMS_PER_PAGE);
  const maxBlogsPages = Math.ceil(totalBlogs / ITEMS_PER_PAGE);

  const displayedWebsites = searchQuery
    ? allWebsites.filter((website) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          website.name.toLowerCase().includes(searchLower) ||
          website.url.toLowerCase().includes(searchLower) ||
          website.description?.toLowerCase().includes(searchLower) ||
          website.shortDescription?.toLowerCase().includes(searchLower)
        );
      })
    : websites;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-row-reverse">
        <div className="flex gap-4">
          <Button
            variant={activeTab === "tools" ? "default" : "outline"}
            onClick={() => setActiveTab("tools")}
          >
            עסקים
          </Button>
          <Button
            variant={activeTab === "blogs" ? "default" : "outline"}
            onClick={() => setActiveTab("blogs")}
          >
            פוסטים בבלוג
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
          >
            משתמשים
          </Button>
        </div>
        <div className="flex gap-2">
          {activeTab === "blogs" ? (
            <Button
              onClick={() => setIsAddBlogPostOpen(true)}
              variant="outline"
            >
              <Plus className="w-4 h-4 ml-2" />
              פוסט חדש
            </Button>
          ) : activeTab === "tools" ? (
            <Button
              onClick={() => setIsAddToolOpen(true)}
              className="gradient-button"
            >
              <Plus className="w-4 h-4 ml-2" />
              הוסף עסק חדש
            </Button>
          ) : null}
        </div>
      </div>

      {activeTab === "users" ? (
        <UserManagement />
      ) : activeTab === "tools" ? (
        <>
          <div className="flex items-center justify-between">
            <Input
              placeholder="חפש עסקים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm text-right"
              dir="rtl"
            />
          </div>

          {isLoadingTools ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">טוען עסקים...</p>
            </div>
          ) : !websites || websites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">לא נמצאו עסקים</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {displayedWebsites.map((website) => (
                  <WebsiteCard
                    key={website._id.toString()}
                    website={website}
                    onUpdate={fetchWebsites}
                  />
                ))}
              </div>
              {!searchQuery && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setToolsPage((p) => Math.max(1, p - 1))}
                    disabled={toolsPage === 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <span className="py-2 px-3 text-sm">
                    עמוד {toolsPage} מתוך {maxToolsPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setToolsPage((p) => Math.min(maxToolsPages, p + 1))
                    }
                    disabled={toolsPage === maxToolsPages}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {isLoadingBlogs ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">טוען פוסטים...</p>
            </div>
          ) : !blogPosts || blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">לא נמצאו פוסטים</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {blogPosts.map((post) => (
                  <BlogPostCard
                    key={post._id.toString()}
                    post={post}
                    onUpdate={fetchBlogPosts}
                  />
                ))}
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBlogsPage((p) => Math.max(1, p - 1))}
                  disabled={blogsPage === 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <span className="py-2 px-3 text-sm">
                  עמוד {blogsPage} מתוך {maxBlogsPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setBlogsPage((p) => Math.min(maxBlogsPages, p + 1))
                  }
                  disabled={blogsPage === maxBlogsPages}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </>
      )}

      <AddToolDialog
        open={isAddToolOpen}
        onOpenChange={setIsAddToolOpen}
        onToolAdded={fetchWebsites}
      />

      <AddBlogPostDialog
        open={isAddBlogPostOpen}
        onOpenChange={setIsAddBlogPostOpen}
        onBlogPostAdded={fetchBlogPosts}
      />
    </div>
  );
}
