"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { WebsiteType } from "@/lib/models/Website";
import { WebsiteCard } from "./website-card";
import { AddToolDialog } from "./add-tool-dialog";
import { AddBlogPostDialog } from "./add-blog-post-dialog";
import { BlogPost } from "@/lib/types/blog";
import { BlogPostCard } from "./blog-post-card";

const ITEMS_PER_PAGE = 10;

export function AdminDashboard() {
  const router = useRouter();
  const [websites, setWebsites] = useState<WebsiteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddToolOpen, setIsAddToolOpen] = useState(false);
  const [isAddBlogPostOpen, setIsAddBlogPostOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tools" | "blogs">("tools");
  const [toolsPage, setToolsPage] = useState(1);
  const [blogsPage, setBlogsPage] = useState(1);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [totalTools, setTotalTools] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [isLoadingTools, setIsLoadingTools] = useState(true);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [allWebsites, setAllWebsites] = useState<WebsiteType[]>([]);

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_IS_PRODUCTION !== "true" &&
      window.location.hostname.includes("localhost")
    ) {
      if (activeTab === "tools") {
        fetchWebsites();
      } else {
        fetchBlogPosts();
      }
    } else {
      router.push("/");
    }
  }, [toolsPage, blogsPage, activeTab]);

  const fetchWebsites = async () => {
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
  };

  const fetchBlogPosts = async () => {
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
  };

  const fetchAllWebsites = async () => {
    try {
      const response = await fetch(`/api/admin/websites?limit=1000`);
      const data = await response.json();
      setAllWebsites(data.websites);
    } catch (error) {
      console.error("Error fetching all websites:", error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchAllWebsites();
    } else {
      fetchWebsites();
    }
  }, [searchQuery]);

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
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <Button
            variant={activeTab === "tools" ? "default" : "outline"}
            onClick={() => setActiveTab("tools")}
          >
            Tools
          </Button>
          <Button
            variant={activeTab === "blogs" ? "default" : "outline"}
            onClick={() => setActiveTab("blogs")}
          >
            Blog Posts
          </Button>
        </div>
        <div className="flex gap-2">
          {activeTab === "blogs" ? (
            <Button
              onClick={() => setIsAddBlogPostOpen(true)}
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Blog Post
            </Button>
          ) : (
            <Button
              onClick={() => setIsAddToolOpen(true)}
              className="gradient-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Tool
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {activeTab === "tools" ? (
        <>
          {isLoadingTools ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading tools...</p>
            </div>
          ) : !websites || websites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tools found</p>
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
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="py-2 px-3 text-sm">
                    Page {toolsPage} of {maxToolsPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setToolsPage((p) => Math.min(maxToolsPages, p + 1))
                    }
                    disabled={toolsPage === maxToolsPages}
                  >
                    <ChevronRight className="w-4 h-4" />
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
              <p className="text-muted-foreground">Loading blog posts...</p>
            </div>
          ) : !blogPosts || blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts found</p>
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
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="py-2 px-3 text-sm">
                  Page {blogsPage} of {maxBlogsPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setBlogsPage((p) => Math.min(maxBlogsPages, p + 1))
                  }
                  disabled={blogsPage === maxBlogsPages}
                >
                  <ChevronRight className="w-4 h-4" />
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
