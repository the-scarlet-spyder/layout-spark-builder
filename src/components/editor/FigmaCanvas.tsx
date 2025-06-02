
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ZoomIn, ZoomOut, Move, RotateCcw } from "lucide-react";

interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: any;
  styles: any;
  zIndex: number;
}

interface FigmaCanvasProps {
  elements: CanvasElement[];
  onElementsChange: (elements: CanvasElement[]) => void;
  selectedElements: string[];
  onSelectionChange: (elementIds: string[]) => void;
  frameWidth: number;
  frameHeight: number;
  onFrameResize: (width: number, height: number) => void;
}

export const FigmaCanvas: React.FC<FigmaCanvasProps> = ({
  elements,
  onElementsChange,
  selectedElements,
  onSelectionChange,
  frameWidth,
  frameHeight,
  onFrameResize
}) => {
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizingFrame, setIsResizingFrame] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [marqueeSelection, setMarqueeSelection] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const zoomScale = zoom / 100;

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleZoomReset = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left click

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - pan.x) / zoomScale;
    const y = (e.clientY - rect.top - pan.y) / zoomScale;

    // Check if clicking on an element
    const clickedElement = elements
      .sort((a, b) => b.zIndex - a.zIndex)
      .find(el => 
        x >= el.x && 
        x <= el.x + el.width && 
        y >= el.y && 
        y <= el.y + el.height
      );

    if (clickedElement) {
      if (e.shiftKey) {
        // Multi-select with shift
        if (selectedElements.includes(clickedElement.id)) {
          onSelectionChange(selectedElements.filter(id => id !== clickedElement.id));
        } else {
          onSelectionChange([...selectedElements, clickedElement.id]);
        }
      } else {
        onSelectionChange([clickedElement.id]);
      }
    } else {
      // Start marquee selection
      if (!e.shiftKey) {
        onSelectionChange([]);
      }
      setMarqueeSelection({
        startX: x,
        startY: y,
        currentX: x,
        currentY: y
      });
    }

    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  }, [elements, selectedElements, onSelectionChange, pan, zoomScale]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - pan.x) / zoomScale;
    const y = (e.clientY - rect.top - pan.y) / zoomScale;

    if (marqueeSelection) {
      // Update marquee selection
      setMarqueeSelection(prev => prev ? {
        ...prev,
        currentX: x,
        currentY: y
      } : null);

      // Find elements within marquee
      const minX = Math.min(marqueeSelection.startX, x);
      const maxX = Math.max(marqueeSelection.startX, x);
      const minY = Math.min(marqueeSelection.startY, y);
      const maxY = Math.max(marqueeSelection.startY, y);

      const selectedIds = elements
        .filter(el => 
          el.x >= minX && 
          el.x + el.width <= maxX && 
          el.y >= minY && 
          el.y + el.height <= maxY
        )
        .map(el => el.id);

      if (e.shiftKey) {
        onSelectionChange([...new Set([...selectedElements, ...selectedIds])]);
      } else {
        onSelectionChange(selectedIds);
      }
    } else if (selectedElements.length > 0) {
      // Move selected elements
      const deltaX = (e.clientX - dragStart.x) / zoomScale;
      const deltaY = (e.clientY - dragStart.y) / zoomScale;

      const updatedElements = elements.map(el => {
        if (selectedElements.includes(el.id)) {
          return {
            ...el,
            x: Math.max(0, el.x + deltaX),
            y: Math.max(0, el.y + deltaY)
          };
        }
        return el;
      });

      onElementsChange(updatedElements);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, marqueeSelection, selectedElements, elements, onElementsChange, onSelectionChange, dragStart, pan, zoomScale]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
    setMarqueeSelection(null);
  }, []);

  const handleFrameResize = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    setIsResizingFrame(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleFrameMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingFrame || !resizeHandle) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    let newWidth = frameWidth;
    let newHeight = frameHeight;

    if (resizeHandle.includes('right')) {
      newWidth = Math.max(200, frameWidth + deltaX / zoomScale);
    }
    if (resizeHandle.includes('left')) {
      newWidth = Math.max(200, frameWidth - deltaX / zoomScale);
    }
    if (resizeHandle.includes('bottom')) {
      newHeight = Math.max(200, frameHeight + deltaY / zoomScale);
    }
    if (resizeHandle.includes('top')) {
      newHeight = Math.max(200, frameHeight - deltaY / zoomScale);
    }

    onFrameResize(newWidth, newHeight);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isResizingFrame, resizeHandle, dragStart, frameWidth, frameHeight, onFrameResize, zoomScale]);

  const handleFrameMouseUp = useCallback(() => {
    setIsResizingFrame(false);
    setResizeHandle(null);
  }, []);

  useEffect(() => {
    if (isResizingFrame) {
      document.addEventListener('mousemove', handleFrameMouseMove);
      document.addEventListener('mouseup', handleFrameMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleFrameMouseMove);
        document.removeEventListener('mouseup', handleFrameMouseUp);
      };
    }
  }, [isResizingFrame, handleFrameMouseMove, handleFrameMouseUp]);

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedElements.includes(element.id);
    
    return (
      <div
        key={element.id}
        className={`absolute border-2 transition-all ${
          isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
        }`}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          zIndex: element.zIndex,
          backgroundColor: element.styles?.backgroundColor || '#ffffff',
          borderRadius: element.styles?.borderRadius || 0,
          padding: element.styles?.padding || 0,
        }}
      >
        {/* Element content based on type */}
        {element.type === 'text' && (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ 
              color: element.styles?.color || '#000000',
              fontSize: element.styles?.fontSize || '16px',
              fontWeight: element.styles?.fontWeight || 'normal'
            }}
          >
            {element.content?.text || 'Text'}
          </div>
        )}
        {element.type === 'button' && (
          <button 
            className="w-full h-full bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            style={element.styles}
          >
            {element.content?.text || 'Button'}
          </button>
        )}
        {element.type === 'rectangle' && (
          <div className="w-full h-full" />
        )}
        
        {/* Selection handles */}
        {isSelected && (
          <>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-nw-resize" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-ne-resize" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-sw-resize" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-se-resize" />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-[#141419] overflow-hidden relative">
      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <div className="bg-[#1E1E2E] border border-[#2B2B3D] rounded-lg p-1 flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleZoomOut}
            className="text-gray-400 hover:text-white hover:bg-[#2B2B3D] h-8 w-8 p-0"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-400 px-2 min-w-[60px] text-center">{zoom}%</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleZoomIn}
            className="text-gray-400 hover:text-white hover:bg-[#2B2B3D] h-8 w-8 p-0"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleZoomReset}
            className="text-gray-400 hover:text-white hover:bg-[#2B2B3D] h-8 w-8 p-0"
            title="Reset zoom and pan"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Frame Dimensions */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#1E1E2E] border border-[#2B2B3D] rounded-lg p-2">
        <span className="text-sm text-gray-400">Frame:</span>
        <Input
          type="number"
          value={frameWidth}
          onChange={(e) => onFrameResize(parseInt(e.target.value) || frameWidth, frameHeight)}
          className="w-20 h-8 bg-[#2B2B3D] border-[#3B3B4D] text-white text-sm"
        />
        <span className="text-gray-400">×</span>
        <Input
          type="number"
          value={frameHeight}
          onChange={(e) => onFrameResize(frameWidth, parseInt(e.target.value) || frameHeight)}
          className="w-20 h-8 bg-[#2B2B3D] border-[#3B3B4D] text-white text-sm"
        />
        <span className="text-sm text-gray-400">px</span>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="w-full h-full overflow-auto cursor-crosshair"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        style={{
          transform: `scale(${zoomScale}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: '0 0'
        }}
      >
        {/* Background grid */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Artboard/Frame */}
        <div className="relative" style={{ width: '200vw', height: '200vh' }}>
          <div 
            ref={frameRef}
            className="relative bg-white border-2 border-[#8A2BE2] shadow-2xl"
            style={{
              width: frameWidth,
              height: frameHeight,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Frame resize handles */}
            <div 
              className="absolute -top-1 -left-1 w-3 h-3 bg-[#8A2BE2] border border-white rounded-sm cursor-nw-resize"
              onMouseDown={(e) => handleFrameResize(e, 'top-left')}
            />
            <div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-[#8A2BE2] border border-white rounded-sm cursor-ne-resize"
              onMouseDown={(e) => handleFrameResize(e, 'top-right')}
            />
            <div 
              className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#8A2BE2] border border-white rounded-sm cursor-sw-resize"
              onMouseDown={(e) => handleFrameResize(e, 'bottom-left')}
            />
            <div 
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#8A2BE2] border border-white rounded-sm cursor-se-resize"
              onMouseDown={(e) => handleFrameResize(e, 'bottom-right')}
            />
            
            {/* Side handles */}
            <div 
              className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#8A2BE2] border border-white rounded-sm cursor-n-resize"
              onMouseDown={(e) => handleFrameResize(e, 'top')}
            />
            <div 
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#8A2BE2] border border-white rounded-sm cursor-s-resize"
              onMouseDown={(e) => handleFrameResize(e, 'bottom')}
            />
            <div 
              className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#8A2BE2] border border-white rounded-sm cursor-w-resize"
              onMouseDown={(e) => handleFrameResize(e, 'left')}
            />
            <div 
              className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#8A2BE2] border border-white rounded-sm cursor-e-resize"
              onMouseDown={(e) => handleFrameResize(e, 'right')}
            />

            {/* Elements */}
            {elements.map(renderElement)}

            {/* Marquee selection */}
            {marqueeSelection && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-10 pointer-events-none"
                style={{
                  left: Math.min(marqueeSelection.startX, marqueeSelection.currentX),
                  top: Math.min(marqueeSelection.startY, marqueeSelection.currentY),
                  width: Math.abs(marqueeSelection.currentX - marqueeSelection.startX),
                  height: Math.abs(marqueeSelection.currentY - marqueeSelection.startY)
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
