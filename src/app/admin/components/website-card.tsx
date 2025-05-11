"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Wand2, Loader2 } from 'lucide-react';
import { EditToolDialog } from './edit-tool-dialog';
import { WebsiteType } from '@/lib/types/website';
import { toast } from 'react-hot-toast';

interface WebsiteCardProps {
  website: WebsiteType;
  onUpdate: () => void;
}

export function WebsiteCard({ website, onUpdate }: WebsiteCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<Partial<WebsiteType> | null>(null);

  const handleGenerateMetadata = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/generate-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: website.url })
      });
      const data = await response.json();
      setGeneratedData(data);
      setIsEditOpen(true);
      toast.success('Data generated successfully! Click Save Changes to update.');
    } catch (error) {
      console.error('Error generating metadata:', error);
      toast.error('Failed to generate data');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-4 bg-secondary/50 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center overflow-hidden">
          {website.logo ? (
            <Image 
              src={website.logo} 
              alt={website.name} 
              width={48} 
              height={48} 
              className="rounded-lg object-cover"
            />
          ) : (
            <span className="text-xl text-zinc-400">{website.name.charAt(0)}</span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{website.name}</h3>
              <a 
                href={`https://${website.url}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {website.url}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateMetadata}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Data
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditOpen(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <EditToolDialog 
        website={website}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={onUpdate}
        generatedData={generatedData}
      />
    </Card>
  );
} 