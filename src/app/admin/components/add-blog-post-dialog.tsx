"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from '@/components/image-upload';
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { slugify } from '@/lib/utils';

interface AddBlogPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBlogPostAdded: () => void;
}

export function AddBlogPostDialog({ open, onOpenChange, onBlogPostAdded }: AddBlogPostDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    coverImage: '',
    author: 'AI-Radar Team',
    tags: '',
    estimatedReadTime: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.content || !formData.excerpt || !formData.category || !formData.coverImage) {
        throw new Error('Please fill in all required fields');
      }

      const response = await fetch('/api/admin/blog-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug: slugify(formData.title),
          tags: formData.tags.split(',').map(tag => tag.trim()),
          estimatedReadTime: parseInt(formData.estimatedReadTime) || 5,
          isPublished: true,
          publishedAt: new Date().toISOString(),
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create blog post');
      }

      toast.success('Blog post created successfully!');
      onBlogPostAdded();
      onOpenChange(false);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        coverImage: '',
        author: 'AI-Radar Team',
        tags: '',
        estimatedReadTime: '',
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create blog post');
      toast.error(error instanceof Error ? error.message : 'Failed to create blog post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label>Cover Image</Label>
            <ImageUpload
              value={formData.coverImage}
              onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
              onRemove={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
            />
          </div>

          <div className="grid gap-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter blog post title"
            />
          </div>

          <div className="grid gap-2">
            <Label>Excerpt (Short Summary)</Label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief description of the post"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label>Content (HTML)</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Blog post content in HTML format"
              rows={10}
            />
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., Tutorials, News, Guides"
            />
          </div>

          <div className="grid gap-2">
            <Label>Tags (comma-separated)</Label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g., AI, Machine Learning, Tools"
            />
          </div>

          <div className="grid gap-2">
            <Label>Estimated Read Time (minutes)</Label>
            <Input
              type="number"
              value={formData.estimatedReadTime}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedReadTime: e.target.value }))}
              placeholder="e.g., 5"
              min={1}
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Blog Post'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 