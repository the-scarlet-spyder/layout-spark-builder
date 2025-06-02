
import React from 'react';
import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone } from "lucide-react";

interface ResponsiveControlsProps {
  currentViewport: 'desktop' | 'tablet' | 'mobile';
  onViewportChange: (viewport: 'desktop' | 'tablet' | 'mobile') => void;
}

export const ResponsiveControls: React.FC<ResponsiveControlsProps> = ({
  currentViewport,
  onViewportChange
}) => {
  return (
    <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-1">
      <Button
        variant={currentViewport === 'desktop' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewportChange('desktop')}
        className="flex items-center gap-1"
      >
        <Monitor className="w-4 h-4" />
        Desktop
      </Button>
      <Button
        variant={currentViewport === 'tablet' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewportChange('tablet')}
        className="flex items-center gap-1"
      >
        <Tablet className="w-4 h-4" />
        Tablet
      </Button>
      <Button
        variant={currentViewport === 'mobile' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewportChange('mobile')}
        className="flex items-center gap-1"
      >
        <Smartphone className="w-4 h-4" />
        Mobile
      </Button>
    </div>
  );
};
