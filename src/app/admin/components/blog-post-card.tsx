"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Clock, CalendarDays } from "lucide-react";
import { BlogPost } from "@/lib/types/blog";
import { formatDate } from "@/lib/utils";
import { EditBlogPostDialog } from "./edit-blog-post-dialog";
import { toast } from "react-hot-toast";

interface BlogPostCardProps {
  post: BlogPost;
  onUpdate: () => void;
}

export function BlogPostCard({ post, onUpdate }: BlogPostCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/blog-posts/${post._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete blog post");

      toast.success("Blog post deleted successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete blog post");
      console.error("Error deleting blog post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.estimatedReadTime} min read
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <EditBlogPostDialog
        post={post}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onBlogPostUpdated={onUpdate}
      />
    </>
  );
} 