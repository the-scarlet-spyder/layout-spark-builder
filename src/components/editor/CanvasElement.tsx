
import React from 'react';

export interface CanvasElementData {
  id: string;
  type: 'text' | 'button' | 'rectangle' | 'circle' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  content: Record<string, any>;
  styles: Record<string, any>;
  zIndex: number;
}

interface CanvasElementProps {
  element: CanvasElementData;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<CanvasElementData>) => void;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate
}) => {
  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <div 
            className="w-full h-full flex items-center justify-center cursor-text"
            style={{ 
              color: element.styles?.color || '#000000',
              fontSize: element.styles?.fontSize || '16px',
              fontWeight: element.styles?.fontWeight || 'normal',
              fontFamily: element.styles?.fontFamily || 'inherit',
              textAlign: element.styles?.textAlign || 'center',
              lineHeight: element.styles?.lineHeight || 'normal'
            }}
          >
            {element.content?.text || 'Text'}
          </div>
        );
      
      case 'button':
        return (
          <button 
            className="w-full h-full rounded transition-colors cursor-pointer"
            style={{
              backgroundColor: element.styles?.backgroundColor || '#3B82F6',
              color: element.styles?.color || '#FFFFFF',
              fontSize: element.styles?.fontSize || '14px',
              fontWeight: element.styles?.fontWeight || '500',
              border: element.styles?.border || 'none',
              borderRadius: element.styles?.borderRadius || '6px'
            }}
          >
            {element.content?.text || 'Button'}
          </button>
        );
      
      case 'rectangle':
        return (
          <div 
            className="w-full h-full"
            style={{
              backgroundColor: element.styles?.backgroundColor || '#E5E7EB',
              borderRadius: element.styles?.borderRadius || '0px',
              border: element.styles?.border || 'none'
            }}
          />
        );
      
      case 'circle':
        return (
          <div 
            className="w-full h-full rounded-full"
            style={{
              backgroundColor: element.styles?.backgroundColor || '#E5E7EB',
              border: element.styles?.border || 'none'
            }}
          />
        );
      
      case 'image':
        return (
          <div 
            className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm"
            style={{
              borderRadius: element.styles?.borderRadius || '0px',
              border: element.styles?.border || 'none'
            }}
          >
            {element.content?.src ? (
              <img 
                src={element.content.src} 
                alt={element.content.alt || 'Image'} 
                className="w-full h-full object-cover"
                style={{ borderRadius: element.styles?.borderRadius || '0px' }}
              />
            ) : (
              'No image'
            )}
          </div>
        );
      
      default:
        return <div className="w-full h-full bg-gray-200" />;
    }
  };

  return (
    <div
      className={`absolute cursor-move select-none ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: element.zIndex,
        transform: element.styles?.transform || 'none'
      }}
      onClick={onSelect}
    >
      {renderContent()}
      
      {/* Resize handles - only show when selected */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-nw-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-sw-resize" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-se-resize" />
          
          {/* Edge handles */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-n-resize" />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-s-resize" />
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-w-resize" />
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-sm cursor-e-resize" />
        </>
      )}
    </div>
  );
};
