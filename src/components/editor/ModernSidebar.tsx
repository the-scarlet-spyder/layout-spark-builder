
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus,
  Type,
  Image,
  Square,
  Upload,
  Folder,
  Settings,
  Palette,
  Layout,
  FileText,
  Globe
} from "lucide-react";
import { BlockLibrary } from "./BlockLibrary";
import { PropertiesPanel } from "./PropertiesPanel";
import { AdvancedStylePanel } from "./AdvancedStylePanel";
import { PublishingPanel } from "./PublishingPanel";

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
  const [activeSection, setActiveSection] = useState('design');

  const sidebarSections = [
    { id: 'design', label: 'Design', icon: Layout },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'elements', label: 'Elements', icon: Square },
    { id: 'uploads', label: 'Uploads', icon: Upload },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'properties', label: 'Properties', icon: Settings },
    { id: 'publish', label: 'Publish', icon: Globe }
  ];

  return (
    <div className="w-80 bg-[#1E1E2E] border-r border-[#2B2B3D] flex flex-col text-white">
      {/* Header */}
      <div className="p-4 border-b border-[#2B2B3D]">
        <h2 className="font-semibold text-lg text-white">Grid Editor</h2>
        <p className="text-sm text-gray-400 mt-1">Build stunning landing pages</p>
      </div>

      {/* Navigation */}
      <div className="border-b border-[#2B2B3D]">
        <div className="grid grid-cols-4 gap-1 p-2">
          {sidebarSections.slice(0, 4).map((section) => {
            const IconComponent = section.icon;
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className={`flex flex-col items-center gap-1 h-16 ${
                  activeSection === section.id 
                    ? 'bg-[#8A2BE2] text-white hover:bg-[#7A1BCF]' 
                    : 'text-gray-400 hover:text-white hover:bg-[#2B2B3D]'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs">{section.label}</span>
              </Button>
            );
          })}
        </div>
        <div className="grid grid-cols-3 gap-1 p-2 pt-0">
          {sidebarSections.slice(4).map((section) => {
            const IconComponent = section.icon;
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className={`flex flex-col items-center gap-1 h-16 ${
                  activeSection === section.id 
                    ? 'bg-[#8A2BE2] text-white hover:bg-[#7A1BCF]' 
                    : 'text-gray-400 hover:text-white hover:bg-[#2B2B3D]'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs">{section.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeSection === 'design' && (
          <div className="p-4 h-full overflow-y-auto">
            <h3 className="font-medium text-white mb-4">Design Elements</h3>
            <BlockLibrary onAddBlock={onAddBlock} />
          </div>
        )}

        {activeSection === 'text' && (
          <div className="p-4 h-full overflow-y-auto">
            <h3 className="font-medium text-white mb-4">Text Tools</h3>
            <div className="space-y-3">
              <Button
                className="w-full justify-start bg-[#2B2B3D] text-white hover:bg-[#3B3B4D] border border-[#3B3B4D]"
                onClick={() => onAddBlock('text')}
              >
                <Type className="w-4 h-4 mr-2" />
                Add Text Block
              </Button>
              <Button
                className="w-full justify-start bg-[#2B2B3D] text-white hover:bg-[#3B3B4D] border border-[#3B3B4D]"
                onClick={() => onAddBlock('hero')}
              >
                <Type className="w-4 h-4 mr-2" />
                Add Hero Section
              </Button>
            </div>
          </div>
        )}

        {activeSection === 'elements' && (
          <div className="p-4 h-full overflow-y-auto">
            <h3 className="font-medium text-white mb-4">Elements</h3>
            <div className="space-y-3">
              <Button
                className="w-full justify-start bg-[#2B2B3D] text-white hover:bg-[#3B3B4D] border border-[#3B3B4D]"
                onClick={() => onAddBlock('image')}
              >
                <Image className="w-4 h-4 mr-2" />
                Add Image
              </Button>
              <Button
                className="w-full justify-start bg-[#2B2B3D] text-white hover:bg-[#3B3B4D] border border-[#3B3B4D]"
                onClick={() => onAddBlock('button')}
              >
                <Square className="w-4 h-4 mr-2" />
                Add Button
              </Button>
              <Button
                className="w-full justify-start bg-[#2B2B3D] text-white hover:bg-[#3B3B4D] border border-[#3B3B4D]"
                onClick={() => onAddBlock('contact')}
              >
                <Square className="w-4 h-4 mr-2" />
                Contact Form
              </Button>
            </div>
          </div>
        )}

        {activeSection === 'uploads' && (
          <div className="p-4 h-full overflow-y-auto">
            <h3 className="font-medium text-white mb-4">Uploads</h3>
            <div className="border-2 border-dashed border-[#3B3B4D] rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Upload images and assets</p>
              <Button className="mt-3 bg-[#8A2BE2] hover:bg-[#7A1BCF] text-white">
                Browse Files
              </Button>
            </div>
          </div>
        )}

        {activeSection === 'templates' && (
          <div className="p-4 h-full overflow-y-auto">
            <h3 className="font-medium text-white mb-4">Templates</h3>
            <div className="space-y-3">
              {templates.map((template) => (
                <div 
                  key={template.id} 
                  className="cursor-pointer hover:bg-[#2B2B3D] transition-colors p-3 border border-[#3B3B4D] rounded-lg"
                  onClick={() => onLoadTemplate(template.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#8A2BE2] rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-white">{template.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'properties' && (
          <div className="p-4 h-full overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-white">Properties</h3>
              <Button
                variant={useAdvancedStyles ? "default" : "outline"}
                size="sm"
                onClick={onToggleAdvancedStyles}
                className={useAdvancedStyles 
                  ? "bg-[#8A2BE2] hover:bg-[#7A1BCF] text-white" 
                  : "border-[#3B3B4D] text-gray-400 hover:text-white hover:bg-[#2B2B3D]"
                }
              >
                <Palette className="w-4 h-4 mr-1" />
                {useAdvancedStyles ? 'Basic' : 'Advanced'}
              </Button>
            </div>
            
            {useAdvancedStyles ? (
              <AdvancedStylePanel 
                selectedBlock={selectedBlock}
                currentViewport={currentViewport}
                onUpdateBlock={onUpdateBlock}
              />
            ) : (
              <PropertiesPanel 
                selectedBlock={selectedBlock}
                onUpdateBlock={onUpdateBlock}
              />
            )}
          </div>
        )}

        {activeSection === 'publish' && (
          <div className="p-4 h-full overflow-y-auto">
            <h3 className="font-medium text-white mb-4">Publish</h3>
            <PublishingPanel project={project} blocks={blocks} />
          </div>
        )}
      </div>
    </div>
  );
};
