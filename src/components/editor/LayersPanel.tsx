
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useCanvas } from "@/contexts/CanvasContext";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Type,
  Square,
  Circle,
  Image as ImageIcon
} from "lucide-react";

interface LayersPanelProps {
  className?: string;
}

const ELEMENT_ICONS = {
  text: Type,
  rectangle: Square,
  circle: Circle,
  button: Square,
  image: ImageIcon,
  shape: Square
};

export const LayersPanel: React.FC<LayersPanelProps> = ({ className = "" }) => {
  const { state, selectElements, updateElement } = useCanvas();
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  
  const currentPage = state.project.pages.find(p => p.id === state.project.currentPageId)!;
  const sortedElements = [...currentPage.elements].sort((a, b) => b.zIndex - a.zIndex);

  const handleLayerClick = (elementId: string, event: React.MouseEvent) => {
    if (event.metaKey || event.ctrlKey) {
      // Multi-select
      const newSelection = state.selectedElementIds.includes(elementId)
        ? state.selectedElementIds.filter(id => id !== elementId)
        : [...state.selectedElementIds, elementId];
      selectElements(newSelection);
    } else {
      selectElements([elementId]);
    }
  };

  const handleToggleVisibility = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const element = currentPage.elements.find(el => el.id === elementId);
    if (element) {
      updateElement(elementId, { visible: !element.visible });
    }
  };

  const handleToggleLock = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const element = currentPage.elements.find(el => el.id === elementId);
    if (element) {
      updateElement(elementId, { locked: !element.locked });
    }
  };

  const handleRename = (elementId: string, newName: string) => {
    updateElement(elementId, { name: newName });
    setEditingLayerId(null);
  };

  const handleLayerDoubleClick = (elementId: string) => {
    setEditingLayerId(elementId);
  };

  return (
    <div className={`w-80 bg-[#1E1E2E] border-r border-[#2B2B3D] flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-[#2B2B3D]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Layers</h2>
          <span className="text-xs text-gray-400">{sortedElements.length} elements</span>
        </div>
      </div>

      {/* Layers List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sortedElements.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="w-16 h-16 bg-[#2B2B3D] rounded-full flex items-center justify-center mx-auto mb-4">
                <Square className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-sm">No elements on canvas</p>
              <p className="text-xs mt-1">Add elements from the library</p>
            </div>
          ) : (
            <div className="space-y-1">
              {sortedElements.map((element) => {
                const IconComponent = ELEMENT_ICONS[element.type] || Square;
                const isSelected = state.selectedElementIds.includes(element.id);
                const isEditing = editingLayerId === element.id;
                
                return (
                  <div
                    key={element.id}
                    className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-[#8A2BE2] text-white' 
                        : 'hover:bg-[#2B2B3D] text-gray-300'
                    }`}
                    onClick={(e) => handleLayerClick(element.id, e)}
                    onDoubleClick={() => handleLayerDoubleClick(element.id)}
                  >
                    {/* Icon */}
                    <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-white/20' : 'bg-[#3B3B4D]'
                    }`}>
                      <IconComponent className={`w-3 h-3 ${
                        isSelected ? 'text-white' : 'text-gray-400'
                      }`} />
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <Input
                          value={element.name}
                          onChange={(e) => updateElement(element.id, { name: e.target.value })}
                          onBlur={(e) => handleRename(element.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleRename(element.id, e.currentTarget.value);
                            } else if (e.key === 'Escape') {
                              setEditingLayerId(null);
                            }
                          }}
                          className="h-6 px-2 bg-[#1E1E2E] border-[#3B3B4D] text-white text-sm"
                          autoFocus
                          onFocus={(e) => e.target.select()}
                        />
                      ) : (
                        <span className={`text-sm truncate block ${
                          isSelected ? 'text-white' : 'text-gray-300'
                        }`}>
                          {element.name}
                        </span>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 ${
                          isSelected 
                            ? 'hover:bg-white/20 text-white' 
                            : 'hover:bg-[#3B3B4D] text-gray-400 hover:text-white'
                        }`}
                        onClick={(e) => handleToggleVisibility(element.id, e)}
                      >
                        {element.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 ${
                          isSelected 
                            ? 'hover:bg-white/20 text-white' 
                            : 'hover:bg-[#3B3B4D] text-gray-400 hover:text-white'
                        }`}
                        onClick={(e) => handleToggleLock(element.id, e)}
                      >
                        {element.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </Button>
                    </div>

                    {/* Z-Index indicator */}
                    <div className="text-xs text-gray-500 font-mono w-6 text-right">
                      {element.zIndex}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
