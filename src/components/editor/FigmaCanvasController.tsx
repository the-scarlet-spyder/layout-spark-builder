
import React, { useState, useCallback } from 'react';
import { FigmaCanvas } from './FigmaCanvas';
import { CanvasElementData } from './CanvasElement';

interface FigmaCanvasControllerProps {
  onSelectionChange?: (selectedIds: string[]) => void;
  onElementsChange?: (elements: CanvasElementData[]) => void;
}

export const FigmaCanvasController: React.FC<FigmaCanvasControllerProps> = ({
  onSelectionChange,
  onElementsChange
}) => {
  const [elements, setElements] = useState<CanvasElementData[]>([
    {
      id: '1',
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      content: { text: 'Hello World' },
      styles: { 
        color: '#000000', 
        fontSize: '24px', 
        fontWeight: 'bold',
        textAlign: 'center'
      },
      zIndex: 1
    },
    {
      id: '2',
      type: 'button',
      x: 150,
      y: 200,
      width: 120,
      height: 40,
      content: { text: 'Click Me' },
      styles: { 
        backgroundColor: '#8A2BE2', 
        color: '#FFFFFF',
        borderRadius: '8px'
      },
      zIndex: 2
    },
    {
      id: '3',
      type: 'rectangle',
      x: 300,
      y: 150,
      width: 100,
      height: 100,
      content: {},
      styles: { 
        backgroundColor: '#E5E7EB',
        borderRadius: '12px'
      },
      zIndex: 3
    }
  ]);

  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [frameWidth, setFrameWidth] = useState(1200);
  const [frameHeight, setFrameHeight] = useState(800);

  const handleElementsChange = useCallback((newElements: CanvasElementData[]) => {
    setElements(newElements);
    onElementsChange?.(newElements);
  }, [onElementsChange]);

  const handleSelectionChange = useCallback((elementIds: string[]) => {
    setSelectedElements(elementIds);
    onSelectionChange?.(elementIds);
  }, [onSelectionChange]);

  const handleFrameResize = useCallback((width: number, height: number) => {
    setFrameWidth(width);
    setFrameHeight(height);
  }, []);

  const addElement = useCallback((type: CanvasElementData['type'], x = 50, y = 50) => {
    const newElement: CanvasElementData = {
      id: Date.now().toString(),
      type,
      x,
      y,
      width: type === 'text' ? 200 : type === 'button' ? 120 : 100,
      height: type === 'text' ? 50 : type === 'button' ? 40 : 100,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      zIndex: Math.max(...elements.map(el => el.zIndex), 0) + 1
    };

    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElements([newElement.id]);
    onElementsChange?.(newElements);
    onSelectionChange?.(newElement.id);
  }, [elements, onElementsChange, onSelectionChange]);

  const getDefaultContent = (type: CanvasElementData['type']) => {
    switch (type) {
      case 'text': return { text: 'New Text' };
      case 'button': return { text: 'Button' };
      case 'image': return { src: '', alt: 'Image' };
      default: return {};
    }
  };

  const getDefaultStyles = (type: CanvasElementData['type']) => {
    switch (type) {
      case 'text': 
        return { 
          color: '#000000', 
          fontSize: '16px', 
          fontWeight: 'normal',
          textAlign: 'left'
        };
      case 'button': 
        return { 
          backgroundColor: '#3B82F6', 
          color: '#FFFFFF',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500'
        };
      case 'rectangle': 
        return { 
          backgroundColor: '#E5E7EB',
          borderRadius: '0px'
        };
      case 'circle': 
        return { 
          backgroundColor: '#E5E7EB'
        };
      default: 
        return {};
    }
  };

  return (
    <FigmaCanvas
      elements={elements}
      onElementsChange={handleElementsChange}
      selectedElements={selectedElements}
      onSelectionChange={handleSelectionChange}
      frameWidth={frameWidth}
      frameHeight={frameHeight}
      onFrameResize={handleFrameResize}
    />
  );
};

// Export utilities for external use
export { type CanvasElementData };
export const useCanvasController = () => {
  return {
    addElement: (type: CanvasElementData['type']) => {
      // This would be implemented to work with the canvas controller
      console.log('Adding element:', type);
    }
  };
};
