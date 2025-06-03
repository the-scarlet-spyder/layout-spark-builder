
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Save, 
  Eye, 
  EyeOff, 
  Globe, 
  Monitor, 
  Tablet, 
  Smartphone,
  Edit3,
  Check,
  X,
  Loader2
} from "lucide-react";

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
  additionalActions?: React.ReactNode;
}

export const EnhancedTopBar: React.FC<EnhancedTopBarProps> = ({
  project,
  isEditingName,
  onToggleEditName,
  onProjectNameChange,
  isPreviewMode,
  onTogglePreview,
  saving,
  onSave,
  onPublish,
  additionalActions
}) => {
  const [localName, setLocalName] = React.useState(project?.name || '');

  React.useEffect(() => {
    setLocalName(project?.name || '');
  }, [project?.name]);

  const handleNameSubmit = () => {
    onProjectNameChange(localName);
    onToggleEditName();
  };

  const handleNameCancel = () => {
    setLocalName(project?.name || '');
    onToggleEditName();
  };

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left Section - Project Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                className="h-8 w-48 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSubmit();
                  if (e.key === 'Escape') handleNameCancel();
                }}
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={handleNameSubmit}
              >
                <Check className="w-4 h-4 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={handleNameCancel}
              >
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">
                {project?.name || 'Untitled Project'}
              </h1>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={onToggleEditName}
              >
                <Edit3 className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          )}
        </div>
        
        {project?.is_published && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Globe className="w-3 h-3 mr-1" />
            Published
          </Badge>
        )}
      </div>

      {/* Center Section - Viewport Controls */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          data-state="active"
        >
          <Monitor className="w-4 h-4 mr-1" />
          Desktop
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-3"
          disabled
        >
          <Tablet className="w-4 h-4 mr-1" />
          Tablet
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-3"
          disabled
        >
          <Smartphone className="w-4 h-4 mr-1" />
          Mobile
        </Button>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePreview}
          className="gap-2"
        >
          {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {isPreviewMode ? 'Edit' : 'Preview'}
        </Button>

        {additionalActions}

        <Separator orientation="vertical" className="h-6" />

        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={saving}
          className="gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save'}
        </Button>

        <Button
          size="sm"
          onClick={onPublish}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Globe className="w-4 h-4" />
          {project?.is_published ? 'Unpublish' : 'Publish'}
        </Button>
      </div>
    </div>
  );
};
