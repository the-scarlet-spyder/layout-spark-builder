
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
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
  const { state, dispatch, selectElements, updateElement } = useCanvas();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeElementId, setResizeElementId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialElementState, setInitialElementState] = useState<any>(null);
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

  // Memoize selected elements to prevent unnecessary re-renders
  const selectedElements = useMemo(() => 
    currentPage.elements.filter(el => state.selectedElementIds.includes(el.id)),
    [currentPage.elements, state.selectedElementIds]
  );

  const snapToGrid = useCallback((value: number) => {
    if (!state.snapToGrid) return value;
    return Math.round(value / state.gridSize) * state.gridSize;
  }, [state.snapToGrid, state.gridSize]);

  const handleElementResize = useCallback((e: React.MouseEvent, elementId: string, handle: string) => {
    e.stopPropagation();
    const element = currentPage.elements.find(el => el.id === elementId);
    if (!element) return;

    setIsResizing(true);
    setResizeHandle(handle);
    setResizeElementId(elementId);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialElementState({ ...element });
  }, [currentPage.elements]);

  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeHandle || !resizeElementId || !initialElementState) return;

    const deltaX = (e.clientX - dragStart.x) / zoomScale;
    const deltaY = (e.clientY - dragStart.y) / zoomScale;
    
    let newWidth = initialElementState.width;
    let newHeight = initialElementState.height;
    let newX = initialElementState.x;
    let newY = initialElementState.y;

    // Handle different resize directions
    if (resizeHandle.includes('right')) {
      newWidth = Math.max(20, initialElementState.width + deltaX);
    }
    if (resizeHandle.includes('left')) {
      newWidth = Math.max(20, initialElementState.width - deltaX);
      newX = initialElementState.x + deltaX;
    }
    if (resizeHandle.includes('bottom')) {
      newHeight = Math.max(20, initialElementState.height + deltaY);
    }
    if (resizeHandle.includes('top')) {
      newHeight = Math.max(20, initialElementState.height - deltaY);
      newY = initialElementState.y + deltaY;
    }

    updateElement(resizeElementId, { 
      width: snapToGrid(newWidth), 
      height: snapToGrid(newHeight),
      x: snapToGrid(newX),
      y: snapToGrid(newY)
    });
  }, [isResizing, resizeHandle, resizeElementId, initialElementState, dragStart, zoomScale, snapToGrid, updateElement]);

  const handleResizeMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizeHandle(null);
    setResizeElementId(null);
    setInitialElementState(null);
  }, []);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, element: any) => {
    e.stopPropagation();
    
    if (e.shiftKey) {
      const newSelection = state.selectedElementIds.includes(element.id)
        ? state.selectedElementIds.filter(id => id !== element.id)
        : [...state.selectedElementIds, element.id];
      selectElements(newSelection);
    } else {
      if (!state.selectedElementIds.includes(element.id)) {
        selectElements([element.id]);
      }
    }

    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  }, [state.selectedElementIds, selectElements]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (isPreviewMode || e.button !== 0) return;

    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / zoomScale;
    const y = (e.clientY - rect.top) / zoomScale;

    // Start marquee selection
    selectElements([]);
    setMarqueeSelection({
      startX: x,
      startY: y,
      currentX: x,
      currentY: y
    });

    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  }, [isPreviewMode, zoomScale, selectElements]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (marqueeSelection) {
      const x = (e.clientX - rect.left) / zoomScale;
      const y = (e.clientY - rect.top) / zoomScale;

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

      // Update all selected elements
      state.selectedElementIds.forEach(elementId => {
        const element = currentPage.elements.find(el => el.id === elementId);
        if (element && !element.locked) {
          updateElement(elementId, {
            x: Math.max(0, element.x + snappedDeltaX),
            y: Math.max(0, element.y + snappedDeltaY)
          });
        }
      });

      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, marqueeSelection, currentPage.elements, state.selectedElementIds, zoomScale, dragStart, snapToGrid, updateElement, selectElements]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setMarqueeSelection(null);
    setGuides([]);
  }, []);

  useEffect(() => {
    if (isDragging && !isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
      };
    }
  }, [isResizing, handleResizeMouseMove, handleResizeMouseUp]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isPreviewMode) return;
    
    const activeElement = document.activeElement;
    const isTyping = activeElement && (
      activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA' || 
      activeElement.hasAttribute('contenteditable') ||
      activeElement.closest('[role="textbox"]')
    );

    if (isTyping) return;

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
    }
  }, [isPreviewMode, state.selectedElementIds, dispatch, selectElements]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderElement = useCallback((element: any) => {
    const isSelected = state.selectedElementIds.includes(element.id);
    
    return (
      <div
        key={element.id}
        className={`absolute select-none transition-none ${
          isSelected ? 'ring-2 ring-blue-500' : ''
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
          opacity: element.props?.opacity ?? 1,
          cursor: element.locked ? 'not-allowed' : 'move'
        }}
        onMouseDown={(e) => handleElementMouseDown(e, element)}
      >
        {/* Element content */}
        {element.type === 'text' && (
          <div 
            className="w-full h-full flex items-center justify-center p-2 pointer-events-none"
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
            className="w-full h-full rounded transition-colors pointer-events-none"
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
          <div className="w-full h-full pointer-events-none" />
        )}
        
        {element.type === 'circle' && (
          <div className="w-full h-full rounded-full pointer-events-none" />
        )}
        
        {/* Selection handles */}
        {isSelected && !isPreviewMode && (
          <>
            <div 
              className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-nw-resize z-10" 
              onMouseDown={(e) => handleElementResize(e, element.id, 'top-left')}
            />
            <div 
              className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-ne-resize z-10"
              onMouseDown={(e) => handleElementResize(e, element.id, 'top-right')}
            />
            <div 
              className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-sw-resize z-10"
              onMouseDown={(e) => handleElementResize(e, element.id, 'bottom-left')}
            />
            <div 
              className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-se-resize z-10"
              onMouseDown={(e) => handleElementResize(e, element.id, 'bottom-right')}
            />
            <div 
              className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-n-resize z-10"
              onMouseDown={(e) => handleElementResize(e, element.id, 'top')}
            />
            <div 
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-s-resize z-10"
              onMouseDown={(e) => handleElementResize(e, element.id, 'bottom')}
            />
            <div 
              className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-w-resize z-10"
              onMouseDown={(e) => handleElementResize(e, element.id, 'left')}
            />
            <div 
              className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-e-resize z-10"
              onMouseDown={(e) => handleElementResize(e, element.id, 'right')}
            />
          </>
        )}
      </div>
    );
  }, [state.selectedElementIds, isPreviewMode, handleElementMouseDown, handleElementResize]);

  return (
    <div className="flex-1 bg-gray-100 overflow-hidden relative">
      <div 
        ref={canvasRef}
        className="w-full h-full overflow-auto"
        style={{
          transform: `scale(${zoomScale})`,
          transformOrigin: 'top left'
        }}
      >
        <div className="min-w-full min-h-full flex items-center justify-center p-12">
          {state.showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: `${state.gridSize}px ${state.gridSize}px`
              }}
            />
          )}

          <div 
            ref={frameRef}
            className="relative shadow-lg border border-gray-300 overflow-hidden bg-white"
            style={{
              width: currentPage.frame.width,
              height: currentPage.frame.height,
              backgroundColor: currentPage.frame.backgroundColor || '#ffffff'
            }}
            onMouseDown={handleCanvasMouseDown}
          >
            {currentPage.elements.map(renderElement)}

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

            {currentPage.elements.length === 0 && !isPreviewMode && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Start designing</h3>
                  <p className="text-sm">Add elements from the left panel to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
