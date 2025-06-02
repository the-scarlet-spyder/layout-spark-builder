
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
    <div className="flex items-center space-x-1 bg-[#2B2B3D] border border-[#3B3B4D] rounded-lg p-1">
      <Button
        variant={currentViewport === 'desktop' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewportChange('desktop')}
        className={`flex items-center gap-2 ${
          currentViewport === 'desktop' 
            ? 'bg-[#8A2BE2] text-white hover:bg-[#7A1BCF]' 
            : 'text-gray-400 hover:text-white hover:bg-[#3B3B4D]'
        }`}
      >
        <Monitor className="w-4 h-4" />
        <span className="hidden sm:inline">Desktop</span>
      </Button>
      <Button
        variant={currentViewport === 'tablet' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewportChange('tablet')}
        className={`flex items-center gap-2 ${
          currentViewport === 'tablet' 
            ? 'bg-[#8A2BE2] text-white hover:bg-[#7A1BCF]' 
            : 'text-gray-400 hover:text-white hover:bg-[#3B3B4D]'
        }`}
      >
        <Tablet className="w-4 h-4" />
        <span className="hidden sm:inline">Tablet</span>
      </Button>
      <Button
        variant={currentViewport === 'mobile' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewportChange('mobile')}
        className={`flex items-center gap-2 ${
          currentViewport === 'mobile' 
            ? 'bg-[#8A2BE2] text-white hover:bg-[#7A1BCF]' 
            : 'text-gray-400 hover:text-white hover:bg-[#3B3B4D]'
        }`}
      >
        <Smartphone className="w-4 h-4" />
        <span className="hidden sm:inline">Mobile</span>
      </Button>
    </div>
  );
};
