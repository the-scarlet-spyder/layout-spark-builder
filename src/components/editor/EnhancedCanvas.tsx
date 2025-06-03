
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useCanvas } from "@/contexts/CanvasContext";

interface Guide {
  type: 'vertical' | 'horizontal';
  position: number;
  elementIds: string[];
}

interface EnhancedCanvasProps {
  isPreviewMode: boolean;
}

export const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({ isPreviewMode }) => {
  const { state, dispatch, selectElements, moveSelectedElements, addElement } = useCanvas();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [guides, setGuides] = useState<Guide[]>([]);
  const [marqueeSelection, setMarqueeSelection] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const currentPage = state.project.pages.find(p => p.id === state.project.currentPageId)!;
  const zoomScale = state.zoom / 100;

  // Calculate smart guides when dragging
  const calculateGuides = useCallback((draggingElementIds: string[]) => {
    const newGuides: Guide[] = [];
    const draggingElements = currentPage.elements.filter(el => draggingElementIds.includes(el.id));
    const staticElements = currentPage.elements.filter(el => !draggingElementIds.includes(el.id));

    if (draggingElements.length === 0) return newGuides;

    draggingElements.forEach(draggingEl => {
      staticElements.forEach(staticEl => {
        // Vertical alignment guides
        if (Math.abs(draggingEl.x - staticEl.x) < 5) {
          newGuides.push({
            type: 'vertical',
            position: staticEl.x,
            elementIds: [draggingEl.id, staticEl.id]
          });
        }
        if (Math.abs((draggingEl.x + draggingEl.width) - (staticEl.x + staticEl.width)) < 5) {
          newGuides.push({
            type: 'vertical',
            position: staticEl.x + staticEl.width,
            elementIds: [draggingEl.id, staticEl.id]
          });
        }
        if (Math.abs(draggingEl.x + draggingEl.width / 2 - (staticEl.x + staticEl.width / 2)) < 5) {
          newGuides.push({
            type: 'vertical',
            position: staticEl.x + staticEl.width / 2,
            elementIds: [draggingEl.id, staticEl.id]
          });
        }

        // Horizontal alignment guides
        if (Math.abs(draggingEl.y - staticEl.y) < 5) {
          newGuides.push({
            type: 'horizontal',
            position: staticEl.y,
            elementIds: [draggingEl.id, staticEl.id]
          });
        }
        if (Math.abs((draggingEl.y + draggingEl.height) - (staticEl.y + staticEl.height)) < 5) {
          newGuides.push({
            type: 'horizontal',
            position: staticEl.y + staticEl.height,
            elementIds: [draggingEl.id, staticEl.id]
          });
        }
        if (Math.abs(draggingEl.y + draggingEl.height / 2 - (staticEl.y + staticEl.height / 2)) < 5) {
          newGuides.push({
            type: 'horizontal',
            position: staticEl.y + staticEl.height / 2,
            elementIds: [draggingEl.id, staticEl.id]
          });
        }
      });
    });

    return newGuides;
  }, [currentPage.elements]);

  const snapToGrid = useCallback((value: number) => {
    if (!state.snapToGrid) return value;
    return Math.round(value / state.gridSize) * state.gridSize;
  }, [state.snapToGrid, state.gridSize]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (isPreviewMode || e.button !== 0) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - state.pan.x) / zoomScale;
    const y = (e.clientY - rect.top - state.pan.y) / zoomScale;

    // Check if clicking on an element
    const clickedElement = currentPage.elements
      .sort((a, b) => b.zIndex - a.zIndex)
      .find(el => 
        x >= el.x && 
        x <= el.x + el.width && 
        y >= el.y && 
        y <= el.y + el.height &&
        el.visible &&
        !el.locked
      );

    if (clickedElement) {
      if (e.shiftKey) {
        const newSelection = state.selectedElementIds.includes(clickedElement.id)
          ? state.selectedElementIds.filter(id => id !== clickedElement.id)
          : [...state.selectedElementIds, clickedElement.id];
        selectElements(newSelection);
      } else {
        selectElements([clickedElement.id]);
      }
    } else {
      if (!e.shiftKey) {
        selectElements([]);
      }
      // Start marquee selection
      setMarqueeSelection({
        startX: x,
        startY: y,
        currentX: x,
        currentY: y
      });
    }

    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  }, [isPreviewMode, currentPage.elements, state.selectedElementIds, state.pan, zoomScale, selectElements]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - state.pan.x) / zoomScale;
    const y = (e.clientY - rect.top - state.pan.y) / zoomScale;

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

      const selectedIds = currentPage.elements
        .filter(el => 
          el.x >= minX && 
          el.x + el.width <= maxX && 
          el.y >= minY && 
          el.y + el.height <= maxY &&
          el.visible &&
          !el.locked
        )
        .map(el => el.id);

      selectElements(selectedIds);
    } else if (state.selectedElementIds.length > 0) {
      // Move selected elements
      const deltaX = (e.clientX - dragStart.x) / zoomScale;
      const deltaY = (e.clientY - dragStart.y) / zoomScale;

      const snappedDeltaX = snapToGrid(deltaX);
      const snappedDeltaY = snapToGrid(deltaY);

      moveSelectedElements(snappedDeltaX, snappedDeltaY);
      setDragStart({ x: e.clientX, y: e.clientY });

      // Calculate and show guides
      if (state.snapToElements) {
        const newGuides = calculateGuides(state.selectedElementIds);
        setGuides(newGuides);
      }
    }
  }, [
    isDragging, 
    marqueeSelection, 
    currentPage.elements, 
    state.selectedElementIds, 
    state.pan, 
    zoomScale, 
    dragStart, 
    snapToGrid, 
    moveSelectedElements, 
    selectElements, 
    calculateGuides, 
    state.snapToElements
  ]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
    setMarqueeSelection(null);
    setGuides([]);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isPreviewMode) return;

    switch (e.key) {
      case 'Delete':
      case 'Backspace':
        if (state.selectedElementIds.length > 0) {
          dispatch({ type: 'DELETE_ELEMENTS', payload: { ids: state.selectedElementIds } });
        }
        break;
      case 'Escape':
        selectElements([]);
        break;
      case 'g':
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          dispatch({ type: 'TOGGLE_GRID' });
        }
        break;
    }
  }, [isPreviewMode, state.selectedElementIds, dispatch, selectElements]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderElement = (element: any) => {
    const isSelected = state.selectedElementIds.includes(element.id);
    
    return (
      <div
        key={element.id}
        className={`absolute cursor-move select-none transition-all ${
          isSelected ? 'ring-2 ring-[#8A2BE2] ring-offset-2 ring-offset-white' : ''
        } ${!element.visible ? 'opacity-50' : ''} ${element.locked ? 'pointer-events-none' : ''}`}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          zIndex: element.zIndex,
          transform: `rotate(${element.rotation || 0}deg)`,
          backgroundColor: element.props?.backgroundColor || 'transparent',
          border: element.props?.border ? 
            `${element.props.border.width}px ${element.props.border.style} ${element.props.border.color}` : 
            'none',
          borderRadius: element.props?.border?.radius || 0,
          opacity: element.props?.opacity ?? 1
        }}
      >
        {element.type === 'text' && (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ 
              color: element.props?.textColor || '#000000',
              fontSize: element.props?.fontSize || 16,
              fontWeight: element.props?.fontWeight || 'normal',
              fontFamily: element.props?.fontFamily || 'inherit',
              textAlign: element.props?.textAlign || 'center',
              lineHeight: element.props?.lineHeight || 'normal'
            }}
          >
            {element.props?.text || 'Text'}
          </div>
        )}
        
        {element.type === 'button' && (
          <button 
            className="w-full h-full rounded transition-colors"
            style={{
              backgroundColor: element.props?.backgroundColor || '#3B82F6',
              color: element.props?.textColor || '#FFFFFF',
              fontSize: element.props?.fontSize || 14,
              fontWeight: element.props?.fontWeight || '500',
              border: 'none'
            }}
          >
            {element.props?.text || 'Button'}
          </button>
        )}
        
        {(element.type === 'rectangle' || element.type === 'shape') && (
          <div className="w-full h-full" />
        )}
        
        {element.type === 'circle' && (
          <div className="w-full h-full rounded-full" />
        )}
        
        {/* Selection handles */}
        {isSelected && !isPreviewMode && (
          <>
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#8A2BE2] border-2 border-white rounded-sm cursor-nw-resize" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#8A2BE2] border-2 border-white rounded-sm cursor-ne-resize" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#8A2BE2] border-2 border-white rounded-sm cursor-sw-resize" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#8A2BE2] border-2 border-white rounded-sm cursor-se-resize" />
            
            {/* Rotation handle */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#8A2BE2] border-2 border-white rounded-full cursor-grab" />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-[#141419] overflow-hidden relative">
      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="w-full h-full overflow-auto cursor-crosshair"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        style={{
          transform: `scale(${zoomScale}) translate(${state.pan.x}px, ${state.pan.y}px)`,
          transformOrigin: '0 0'
        }}
      >
        {/* Grid background */}
        {state.showGrid && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(138, 43, 226, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(138, 43, 226, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: `${state.gridSize}px ${state.gridSize}px`
            }}
          />
        )}

        {/* Main frame */}
        <div className="relative" style={{ width: '200vw', height: '200vh' }}>
          <div 
            ref={frameRef}
            className="relative bg-white border-2 border-[#8A2BE2] shadow-2xl overflow-hidden"
            style={{
              width: currentPage.frame.width,
              height: currentPage.frame.height,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: currentPage.frame.backgroundColor
            }}
          >
            {/* Elements */}
            {currentPage.elements.map(renderElement)}

            {/* Smart guides */}
            {guides.map((guide, index) => (
              <div
                key={index}
                className="absolute border-red-500 border-dashed pointer-events-none z-50"
                style={{
                  [guide.type === 'vertical' ? 'left' : 'top']: guide.position,
                  [guide.type === 'vertical' ? 'top' : 'left']: 0,
                  [guide.type === 'vertical' ? 'bottom' : 'right']: 0,
                  [guide.type === 'vertical' ? 'borderLeftWidth' : 'borderTopWidth']: 1
                }}
              />
            ))}

            {/* Marquee selection */}
            {marqueeSelection && (
              <div
                className="absolute border-2 border-[#8A2BE2] bg-[#8A2BE2] bg-opacity-10 pointer-events-none"
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
