
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface PublishingPanelProps {
  project: any;
  blocks: any[];
}

export const PublishingPanel: React.FC<PublishingPanelProps> = ({ project, blocks }) => {
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState(project?.published_url || '');
  const [customDomain, setCustomDomain] = useState('');
  const { toast } = useToast();

  const handlePublish = async () => {
    setPublishing(true);
    try {
      // Save current state first
      const { error: saveError } = await supabase
        .from('projects')
        .update({
          blocks,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (saveError) throw saveError;

      // Call the edge function to generate static site
      const { data, error } = await supabase.functions.invoke('generate-static-site', {
        body: {
          projectId: project.id,
          customDomain: customDomain || undefined
        }
      });

      if (error) throw error;

      // Update project with published URL
      await supabase
        .from('projects')
        .update({
          is_published: true,
          published_at: new Date().toISOString(),
          published_url: data.url
        })
        .eq('id', project.id);

      setPublishedUrl(data.url);
      
      toast({
        title: "Success!",
        description: "Your site has been published successfully.",
      });

    } catch (error: any) {
      toast({
        title: "Publishing Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publishedUrl);
      toast({
        title: "Copied!",
        description: "URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Publish Your Site
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customDomain" className="text-xs">Custom Subdomain (Optional)</Label>
            <Input
              id="customDomain"
              placeholder="my-awesome-site"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="h-8"
            />
            <p className="text-xs text-gray-500 mt-1">
              Will create: {customDomain || project.slug}.grid-app.site
            </p>
          </div>

          <Button 
            onClick={handlePublish}
            disabled={publishing}
            className="w-full"
          >
            {publishing ? 'Publishing...' : 'Publish Site'}
          </Button>

          {publishedUrl && (
            <div className="border rounded-lg p-3 bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Site Published!</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={publishedUrl}
                  readOnly
                  className="h-8 text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="h-8 px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(publishedUrl, '_blank')}
                  className="h-8 px-2"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Page Title</Label>
            <Input
              placeholder="My Awesome Landing Page"
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Meta Description</Label>
            <Input
              placeholder="A brief description of your page"
              className="h-8"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
