
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Type, 
  Image, 
  Square, 
  Mail, 
  Play, 
  Save, 
  Eye,
  Palette,
  Settings,
  Plus
} from "lucide-react";
import { DragDropCanvas } from "@/components/editor/DragDropCanvas";
import { BlockLibrary } from "@/components/editor/BlockLibrary";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";

const Editor = () => {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [canvasBlocks, setCanvasBlocks] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const addBlockToCanvas = (blockType) => {
    const newBlock = {
      id: Date.now().toString(),
      type: blockType,
      content: getDefaultContent(blockType),
      styles: getDefaultStyles(blockType)
    };
    setCanvasBlocks([...canvasBlocks, newBlock]);
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case 'hero':
        return {
          title: 'Your Amazing Headline',
          subtitle: 'Compelling subtitle that converts visitors into customers',
          buttonText: 'Get Started'
        };
      case 'text':
        return {
          text: 'Add your text content here. Click to edit and customize.'
        };
      case 'image':
        return {
          src: '/placeholder.svg',
          alt: 'Placeholder image'
        };
      case 'button':
        return {
          text: 'Click Me',
          link: '#'
        };
      case 'contact':
        return {
          title: 'Contact Us',
          fields: ['name', 'email', 'message']
        };
      default:
        return {};
    }
  };

  const getDefaultStyles = (type) => {
    return {
      backgroundColor: '#ffffff',
      padding: '2rem',
      textAlign: 'center',
      fontSize: '1rem',
      color: '#000000'
    };
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg">Page Builder</h2>
          <div className="flex gap-2 mt-3">
            <Button 
              variant={isPreviewMode ? "outline" : "default"} 
              size="sm"
              onClick={() => setIsPreviewMode(false)}
            >
              <Settings className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant={isPreviewMode ? "default" : "outline"} 
              size="sm"
              onClick={() => setIsPreviewMode(true)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 m-4">
            <TabsTrigger value="blocks">Blocks</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>
          
          <TabsContent value="blocks" className="flex-1 p-4 pt-0">
            <BlockLibrary onAddBlock={addBlockToCanvas} />
          </TabsContent>
          
          <TabsContent value="properties" className="flex-1 p-4 pt-0">
            <PropertiesPanel 
              selectedBlock={selectedBlock}
              onUpdateBlock={(updatedBlock) => {
                setCanvasBlocks(blocks => 
                  blocks.map(block => 
                    block.id === updatedBlock.id ? updatedBlock : block
                  )
                );
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold">Untitled Page</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm">
              <Play className="w-4 h-4 mr-1" />
              Publish
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8">
          <DragDropCanvas 
            blocks={canvasBlocks}
            onSelectBlock={setSelectedBlock}
            selectedBlock={selectedBlock}
            isPreviewMode={isPreviewMode}
            onUpdateBlocks={setCanvasBlocks}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
