"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { AddToolDialog } from "./add-tool-dialog";
import { WebsiteType } from "@/lib/models/Website";

interface WebsiteCardProps {
  website: WebsiteType;
  onUpdate: () => void;
}

export function WebsiteCard({ website, onUpdate }: WebsiteCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <Card
      className="p-4 bg-white border border-border shadow-sm hover:shadow-md transition-shadow"
      dir="rtl"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-secondary/50 border border-border flex items-center justify-center overflow-hidden">
          {website.logo ? (
            <Image
              src={website.logo}
              alt={website.name}
              width={48}
              height={48}
              className="rounded-lg object-cover"
            />
          ) : (
            <span className="text-xl text-muted-foreground">
              {website.name.charAt(0)}
            </span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="text-right flex-1">
              <h3 className="font-semibold text-right">{website.name}</h3>
              <a
                href={`https://${website.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors block text-right"
              >
                {website.url}
              </a>
              {website.shortDescription && (
                <p className="text-sm text-muted-foreground mt-1 text-right">
                  {website.shortDescription}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 mr-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditOpen(true)}
              >
                <Edit2 className="w-4 h-4 ml-2" />
                ערוך
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AddToolDialog
        website={website}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onToolAdded={onUpdate}
      />
    </Card>
  );
}
