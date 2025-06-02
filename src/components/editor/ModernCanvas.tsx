
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ZoomIn, ZoomOut } from "lucide-react";
import { DragDropCanvas } from "./DragDropCanvas";

interface ModernCanvasProps {
  blocks: any[];
  onSelectBlock: (block: any) => void;
  selectedBlock: any;
  isPreviewMode: boolean;
  onUpdateBlocks: (blocks: any[]) => void;
  onAddBlock: (blockType: string) => void;
  currentViewport: 'desktop' | 'tablet' | 'mobile';
}

export const ModernCanvas: React.FC<ModernCanvasProps> = ({
  blocks,
  onSelectBlock,
  selectedBlock,
  isPreviewMode,
  onUpdateBlocks,
  onAddBlock,
  currentViewport
}) => {
  const getCanvasWidth = () => {
    switch (currentViewport) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-5xl';
    }
  };

  return (
    <div className="flex-1 bg-[#141419] overflow-auto">
      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div className="bg-[#1E1E2E] border border-[#2B2B3D] rounded-lg p-1 flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-[#2B2B3D] h-8 w-8 p-0"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-400 px-2">100%</span>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-[#2B2B3D] h-8 w-8 p-0"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="p-8 min-h-full">
        <div className={`mx-auto transition-all duration-300 ${getCanvasWidth()}`}>
          {blocks.length === 0 ? (
            <Card className="border-2 border-dashed border-[#3B3B4D] bg-[#1E1E2E] p-16 text-center">
              <div className="text-gray-400">
                <div className="w-16 h-16 bg-[#2B2B3D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-white">Start Building Your Page</h3>
                <p className="text-gray-400 mb-6">
                  Choose from our design elements to create your perfect landing page
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => onAddBlock('hero')}
                    className="bg-[#8A2BE2] hover:bg-[#7A1BCF] text-white"
                  >
                    Add Hero Section
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => onAddBlock('text')}
                    className="border-[#3B3B4D] text-gray-300 hover:text-white hover:bg-[#2B2B3D]"
                  >
                    Add Text Block
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              <DragDropCanvas 
                blocks={blocks}
                onSelectBlock={onSelectBlock}
                selectedBlock={selectedBlock}
                isPreviewMode={isPreviewMode}
                onUpdateBlocks={onUpdateBlocks}
                onAddBlock={onAddBlock}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
