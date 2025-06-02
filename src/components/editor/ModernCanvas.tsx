
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FigmaCanvasController } from "./FigmaCanvasController";

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
  // For now, we'll show the new canvas if there are no blocks
  // In the future, we'll migrate all blocks to canvas elements
  const showFigmaCanvas = blocks.length === 0;

  if (showFigmaCanvas) {
    return (
      <div className="flex-1 bg-[#141419] overflow-hidden">
        <FigmaCanvasController 
          onSelectionChange={(selectedIds) => {
            // Handle selection changes
            console.log('Selected elements:', selectedIds);
          }}
          onElementsChange={(elements) => {
            // Handle element changes
            console.log('Elements updated:', elements);
          }}
        />
      </div>
    );
  }

  // Fallback to original block-based canvas
  const getCanvasWidth = () => {
    switch (currentViewport) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-5xl';
    }
  };

  return (
    <div className="flex-1 bg-[#141419] overflow-auto">
      {/* Canvas Area */}
      <div className="p-8 min-h-full">
        <div className={`mx-auto transition-all duration-300 ${getCanvasWidth()}`}>
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
                  Try New Canvas
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
        </div>
      </div>
    </div>
  );
};
