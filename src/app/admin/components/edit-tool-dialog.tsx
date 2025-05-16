"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import categoriesData from "@/lib/data/categories.json";
import { WebsiteType } from "@/lib/types/website";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "react-hot-toast";

interface EditToolDialogProps {
  website: WebsiteType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  generatedData?: Partial<WebsiteType> | null;
}

interface FormData {
  name: string;
  url: string;
  description: string;
  shortDescription: string;
  category: string;
  logo: string;
  launchYear: number | null;
}

export function EditToolDialog({
  website,
  open,
  onOpenChange,
  onSave,
  generatedData,
}: EditToolDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: website.name,
    url: website.url,
    description: website.description || "",
    shortDescription: website.shortDescription || "",
    category: website.category,
    logo: website.logo || "",
    launchYear: website.launchYear || null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/websites/${website._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update");

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating website:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyGeneratedData = () => {
    if (generatedData) {
      const updatedData = {
        ...generatedData,
        category: generatedData.category || formData.category,
      };

      setFormData((prev) => ({
        ...prev,
        ...updatedData,
      }));
      toast.success("Generated data applied");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Tool: {website.name}</DialogTitle>
        </DialogHeader>

        {generatedData && (
          <div className="flex items-center justify-between py-2 px-4 bg-secondary rounded-lg">
            <span className="text-sm">New data has been generated</span>
            <Button size="sm" onClick={handleApplyGeneratedData}>
              Apply Changes
            </Button>
          </div>
        )}

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label>Logo</Label>
            <ImageUpload
              value={formData.logo || ""}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, logo: url }))
              }
              onRemove={() => setFormData((prev) => ({ ...prev, logo: "" }))}
            />
          </div>

          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>URL</Label>
            <Input
              value={formData.url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, url: e.target.value }))
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Short Description</Label>
            <Input
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shortDescription: e.target.value,
                }))
              }
              placeholder="Brief description (10 words max)"
            />
          </div>

          <div className="grid gap-2">
            <Label>Full Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Detailed description"
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesData.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Launch Year</Label>
            <Input
              type="number"
              value={formData.launchYear?.toString() || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  launchYear: parseInt(e.target.value) || null,
                }))
              }
              min={2000}
              max={new Date().getFullYear()}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
