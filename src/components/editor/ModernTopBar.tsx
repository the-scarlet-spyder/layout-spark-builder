
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
  Download,
  Undo,
  Plus,
  Edit2
} from "lucide-react";
import { ResponsiveControls } from "./ResponsiveControls";

interface ModernTopBarProps {
  project: any;
  isEditingName: boolean;
  onToggleEditName: () => void;
  onProjectNameChange: (name: string) => void;
  canvasBlocks: any[];
  currentViewport: 'desktop' | 'tablet' | 'mobile';
  onViewportChange: (viewport: 'desktop' | 'tablet' | 'mobile') => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  saving: boolean;
  onSave: () => void;
  onPublish: () => void;
}

export const ModernTopBar: React.FC<ModernTopBarProps> = ({
  project,
  isEditingName,
  onToggleEditName,
  onProjectNameChange,
  canvasBlocks,
  currentViewport,
  onViewportChange,
  isPreviewMode,
  onTogglePreview,
  saving,
  onSave,
  onPublish
}) => {
  return (
    <div className="bg-[#1E1E2E] border-b border-[#2B2B3D] px-6 py-3 flex items-center justify-between">
      {/* Left Section - File/Project Management */}
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
              <Edit2 className="w-4 h-4 text-gray-400" />
            </h1>
          )}
          <span className="text-sm text-gray-400">({canvasBlocks.length} blocks)</span>
        </div>
      </div>

      {/* Center Section - Editing Tools */}
      <div className="flex items-center gap-4">
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
        
        <ResponsiveControls
          currentViewport={currentViewport}
          onViewportChange={onViewportChange}
        />
      </div>

      {/* Right Section - Sharing/Publishing */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-white hover:bg-[#2B2B3D]"
        >
          <Undo className="w-4 h-4 mr-1" />
          Undo
        </Button>
        
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
