
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ElementLibrary } from "./ElementLibrary";
import { LayersPanel } from "./LayersPanel";
import { 
  Palette, 
  Layers, 
  Upload, 
  Layout, 
  Settings,
  Search
} from "lucide-react";

interface ModernSidebarProps {
  selectedBlock: any;
  onAddBlock: (blockType: string) => void;
  onUpdateBlock: (block: any) => void;
  templates: any[];
  onLoadTemplate: (templateId: string) => void;
  project: any;
  blocks: any[];
  currentViewport: 'desktop' | 'tablet' | 'mobile';
  useAdvancedStyles: boolean;
  onToggleAdvancedStyles: () => void;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  selectedBlock,
  onAddBlock,
  onUpdateBlock,
  templates,
  onLoadTemplate,
  project,
  blocks,
  currentViewport,
  useAdvancedStyles,
  onToggleAdvancedStyles
}) => {
  const [activeTab, setActiveTab] = useState('elements');

  return (
    <div className="w-80 bg-[#1E1E2E] border-r border-[#2B2B3D] flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-[#2B2B3D] p-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#2B2B3D] h-10">
            <TabsTrigger 
              value="elements" 
              className="text-xs data-[state=active]:bg-[#8A2BE2] data-[state=active]:text-white"
            >
              <Palette className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger 
              value="layers" 
              className="text-xs data-[state=active]:bg-[#8A2BE2] data-[state=active]:text-white"
            >
              <Layers className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger 
              value="assets" 
              className="text-xs data-[state=active]:bg-[#8A2BE2] data-[state=active]:text-white"
            >
              <Upload className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="text-xs data-[state=active]:bg-[#8A2BE2] data-[state=active]:text-white"
            >
              <Layout className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="elements" className="m-0 p-0">
            <ElementLibrary />
          </TabsContent>

          <TabsContent value="layers" className="m-0 p-0">
            <LayersPanel />
          </TabsContent>

          <TabsContent value="assets" className="m-0 p-0">
            <div className="p-4">
              <div className="text-center py-8 text-gray-400">
                <div className="w-16 h-16 bg-[#2B2B3D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-white">Upload Assets</h3>
                <p className="text-sm mb-4">Upload images, videos, and other media files</p>
                <Button className="bg-[#8A2BE2] hover:bg-[#7A1BCF] text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="m-0 p-0">
            <div className="p-4">
              <div className="text-center py-8 text-gray-400">
                <div className="w-16 h-16 bg-[#2B2B3D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layout className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-white">Templates</h3>
                <p className="text-sm mb-4">Pre-designed layouts and components</p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-[#3B3B4D] text-gray-300 hover:text-white hover:bg-[#2B2B3D]"
                  >
                    Browse Templates
                  </Button>
                  <Badge variant="secondary" className="bg-[#8A2BE2] text-white">
                    Coming Soon
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
