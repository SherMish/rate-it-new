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
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { WebsiteType } from "@/lib/models/Website";
import { EditToolDialog } from "./edit-tool-dialog";

interface AddToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToolAdded: () => void;
}

export function AddToolDialog({
  open,
  onOpenChange,
  onToolAdded,
}: AddToolDialogProps) {
  const [formData, setFormData] = useState({
    url: "",
    name: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newWebsite, setNewWebsite] = useState<WebsiteType | null>(null);
  const [generatedData, setGeneratedData] =
    useState<Partial<WebsiteType> | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Reset state when edit dialog is closed
  const handleEditDialogChange = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) {
      setNewWebsite(null);
      setGeneratedData(null);
      setFormData({ url: "", name: "" });
    }
  };

  const handleSubmit = async () => {
    if (!formData.url || !formData.name) return;
    setIsLoading(true);
    setFormError(null); // Clear previous errors

    try {
      const response = await fetch("/api/admin/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.error === "Website already exists") {
          setFormError("This website is already in the database");
        } else {
          setFormError(data.error || "Failed to create website");
        }
        return;
      }

      // Continue with metadata generation...
      const metadataResponse = await fetch("/api/admin/generate-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.url }),
      });

      const metadata = await metadataResponse.json();
      setNewWebsite(data);
      setGeneratedData(metadata);
      setIsEditOpen(true);
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding website:", error);
      setFormError("Failed to add website. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Tool</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formError && (
              <p className="text-sm text-red-500 mb-4">❌ {formError}</p>
            )}
            <div className="space-y-2">
              <Label>Tool Name</Label>
              <Input
                placeholder="Tool name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input
                placeholder="website.com"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isLoading || !formData.url || !formData.name}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {newWebsite && (
        <EditToolDialog
          website={newWebsite}
          open={isEditOpen}
          onOpenChange={handleEditDialogChange}
          onSave={onToolAdded}
          generatedData={generatedData}
        />
      )}
    </>
  );
}
