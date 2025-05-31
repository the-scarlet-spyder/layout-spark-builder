
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Type, 
  Image, 
  Square, 
  Mail, 
  Star,
  Plus
} from "lucide-react";

const blockTypes = [
  {
    id: 'hero',
    name: 'Hero Section',
    icon: Star,
    description: 'Eye-catching header with title and CTA'
  },
  {
    id: 'text',
    name: 'Text Block',
    icon: Type,
    description: 'Simple text content block'
  },
  {
    id: 'image',
    name: 'Image',
    icon: Image,
    description: 'Add images to your page'
  },
  {
    id: 'button',
    name: 'Button',
    icon: Square,
    description: 'Call-to-action button'
  },
  {
    id: 'contact',
    name: 'Contact Form',
    icon: Mail,
    description: 'Contact form with fields'
  }
];

export const BlockLibrary = ({ onAddBlock }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm text-gray-600 uppercase tracking-wide">
        Available Blocks
      </h3>
      
      {blockTypes.map((blockType) => {
        const IconComponent = blockType.icon;
        
        return (
          <Card 
            key={blockType.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onAddBlock(blockType.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{blockType.name}</h4>
                    <Plus className="w-3 h-3 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {blockType.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
