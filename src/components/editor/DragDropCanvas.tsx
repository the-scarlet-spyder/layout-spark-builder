
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, MoveUp, MoveDown } from "lucide-react";
import { RenderableBlock } from "./RenderableBlock";

export const DragDropCanvas = ({ 
  blocks, 
  onSelectBlock, 
  selectedBlock, 
  isPreviewMode,
  onUpdateBlocks 
}) => {
  const handleBlockClick = (block) => {
    if (!isPreviewMode) {
      onSelectBlock(block);
    }
  };

  const updateBlock = (updatedBlock) => {
    onUpdateBlocks(blocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ));
  };

  const deleteBlock = (blockId) => {
    onUpdateBlocks(blocks.filter(block => block.id !== blockId));
    if (selectedBlock?.id === blockId) {
      onSelectBlock(null);
    }
  };

  const moveBlock = (blockId, direction) => {
    const currentIndex = blocks.findIndex(block => block.id === blockId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newBlocks[currentIndex], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[currentIndex]];
    onUpdateBlocks(newBlocks);
  };

  if (blocks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="text-gray-500">
            <h3 className="text-lg font-medium mb-2">Start Building Your Page</h3>
            <p>Drag blocks from the sidebar to begin creating your landing page</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {blocks.map((block, index) => (
        <div key={block.id} className="relative group">
          <div
            className={`
              border-2 transition-all duration-200 rounded-lg overflow-hidden cursor-pointer
              ${selectedBlock?.id === block.id 
                ? 'border-blue-500 shadow-lg' 
                : 'border-transparent hover:border-gray-300'
              }
            `}
            onClick={() => handleBlockClick(block)}
          >
            <RenderableBlock 
              block={block} 
              isPreviewMode={isPreviewMode} 
              onUpdateBlock={updateBlock}
            />
          </div>

          {/* Block Controls */}
          {!isPreviewMode && selectedBlock?.id === block.id && (
            <div className="absolute top-2 right-2 flex gap-1 bg-white rounded-md shadow-md border p-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  moveBlock(block.id, 'up');
                }}
                disabled={index === 0}
                className="h-6 w-6 p-0"
                title="Move up"
              >
                <MoveUp className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  moveBlock(block.id, 'down');
                }}
                disabled={index === blocks.length - 1}
                className="h-6 w-6 p-0"
                title="Move down"
              >
                <MoveDown className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBlock(block.id);
                }}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                title="Delete block"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
