
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Settings, 
  Share, 
  Globe,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw
} from "lucide-react";
import { useCanvas } from "@/contexts/CanvasContext";

interface EnhancedTopBarProps {
  project: any;
  isEditingName: boolean;
  onToggleEditName: () => void;
  onProjectNameChange: (name: string) => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  saving: boolean;
  onSave: () => void;
  onPublish: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const DEVICE_BREAKPOINTS = {
  desktop: { width: 1200, icon: Monitor, label: 'Desktop' },
  tablet: { width: 768, icon: Tablet, label: 'Tablet' },
  mobile: { width: 375, icon: Smartphone, label: 'Mobile' }
};

export const EnhancedTopBar: React.FC<EnhancedTopBarProps> = ({
  project,
  isEditingName,
  onToggleEditName,
  onProjectNameChange,
  isPreviewMode,
  onTogglePreview,
  saving,
  onSave,
  onPublish
}) => {
  const { state, dispatch, canUndo, canRedo, undo, redo } = useCanvas();
  const [currentDevice, setCurrentDevice] = React.useState<DeviceType>('desktop');
  
  const handleZoomChange = (newZoom: number) => {
    dispatch({ type: 'SET_ZOOM', payload: { zoom: newZoom } });
  };
  
  const handleZoomIn = () => {
    handleZoomChange(state.zoom + 25);
  };
  
  const handleZoomOut = () => {
    handleZoomChange(state.zoom - 25);
  };
  
  const handleFitToCanvas = () => {
    handleZoomChange(100);
    dispatch({ type: 'SET_PAN', payload: { pan: { x: 0, y: 0 } } });
  };
  
  const handleDeviceChange = (device: DeviceType) => {
    setCurrentDevice(device);
    const { width } = DEVICE_BREAKPOINTS[device];
    dispatch({ 
      type: 'UPDATE_FRAME', 
      payload: { 
        updates: { width } 
      } 
    });
  };
  
  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    } else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      redo();
    }
  }, [undo, redo]);
  
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  const currentPage = state.project.pages.find(p => p.id === state.project.currentPageId);
  const elementCount = currentPage?.elements.length || 0;

  return (
    <div className="bg-[#1E1E2E] border-b border-[#2B2B3D] px-6 py-3 flex items-center justify-between">
      {/* Left Section - Project Management */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2B2B3D]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        
        <div className="flex items-center gap-3">
          {isEditingName ? (
            <Input
              value={project?.name || ''}
              onChange={(e) => onProjectNameChange(e.target.value)}
              onBlur={() => onToggleEditName()}
              onKeyDown={(e) => e.key === 'Enter' && onToggleEditName()}
              className="font-semibold text-lg bg-[#2B2B3D] border-[#3B3B4D] text-white focus:border-[#8A2BE2]"
              autoFocus
            />
          ) : (
            <h1 
              className="font-semibold text-lg cursor-pointer hover:bg-[#2B2B3D] px-3 py-2 rounded flex items-center gap-2 text-white"
              onClick={onToggleEditName}
            >
              {project?.name || 'Untitled Project'}
            </h1>
          )}
          <span className="text-sm text-gray-400">({elementCount} elements)</span>
        </div>
      </div>

      {/* Center Section - Controls */}
      <div className="flex items-center gap-4">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 bg-[#2B2B3D] rounded-lg p-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            className="text-gray-400 hover:text-white hover:bg-[#3B3B4D] disabled:opacity-50 h-8 w-8 p-0"
            title="Undo (Cmd+Z)"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            className="text-gray-400 hover:text-white hover:bg-[#3B3B4D] disabled:opacity-50 h-8 w-8 p-0"
            title="Redo (Cmd+Y)"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        {/* Device Preview */}
        <div className="flex items-center gap-1 bg-[#2B2B3D] rounded-lg p-1">
          {Object.entries(DEVICE_BREAKPOINTS).map(([device, config]) => {
            const IconComponent = config.icon;
            return (
              <Button
                key={device}
                variant={currentDevice === device ? "default" : "ghost"}
                size="sm"
                onClick={() => handleDeviceChange(device as DeviceType)}
                className={`h-8 w-8 p-0 ${
                  currentDevice === device 
                    ? 'bg-[#8A2BE2] text-white hover:bg-[#7A1BCF]' 
                    : 'text-gray-400 hover:text-white hover:bg-[#3B3B4D]'
                }`}
                title={`${config.label} (${config.width}px)`}
              >
                <IconComponent className="w-4 h-4" />
              </Button>
            );
          })}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-[#2B2B3D] rounded-lg p-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleZoomOut}
            className="text-gray-400 hover:text-white hover:bg-[#3B3B4D] h-8 w-8 p-0"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Input
            type="number"
            value={state.zoom}
            onChange={(e) => handleZoomChange(parseInt(e.target.value) || 100)}
            className="w-16 h-8 bg-[#3B3B4D] border-[#4B4B5D] text-white text-center text-sm"
            min="25"
            max="400"
          />
          <span className="text-gray-400 text-sm">%</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleZoomIn}
            className="text-gray-400 hover:text-white hover:bg-[#3B3B4D] h-8 w-8 p-0"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleFitToCanvas}
            className="text-gray-400 hover:text-white hover:bg-[#3B3B4D] h-8 w-8 p-0"
            title="Fit to Canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Edit/Preview Toggle */}
        <div className="flex items-center gap-2 bg-[#2B2B3D] rounded-lg p-1">
          <Button 
            variant={isPreviewMode ? "ghost" : "default"} 
            size="sm"
            onClick={() => onTogglePreview()}
            className={isPreviewMode 
              ? "text-gray-400 hover:text-white hover:bg-[#3B3B4D]" 
              : "bg-[#8A2BE2] text-white hover:bg-[#7A1BCF]"
            }
          >
            <Settings className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant={isPreviewMode ? "default" : "ghost"} 
            size="sm"
            onClick={() => onTogglePreview()}
            className={isPreviewMode 
              ? "bg-[#8A2BE2] text-white hover:bg-[#7A1BCF]" 
              : "text-gray-400 hover:text-white hover:bg-[#3B3B4D]"
            }
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
        </div>
      </div>

      {/* Right Section - Save/Publish */}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSave} 
          disabled={saving}
          className="border-[#3B3B4D] text-gray-300 hover:text-white hover:bg-[#2B2B3D]"
        >
          <Save className="w-4 h-4 mr-1" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-[#2B2B3D]"
        >
          <Share className="w-4 h-4 mr-1" />
          Share
        </Button>
        
        <Button 
          size="sm" 
          onClick={onPublish}
          className="bg-[#8A2BE2] hover:bg-[#7A1BCF] text-white"
        >
          <Globe className="w-4 h-4 mr-1" />
          {project?.is_published ? 'Update' : 'Publish'}
        </Button>
      </div>
    </div>
  );
};
