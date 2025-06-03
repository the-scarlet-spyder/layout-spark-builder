
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useCanvas } from "@/contexts/CanvasContext";
import { 
  Type, 
  Square, 
  Circle, 
  Image as ImageIcon, 
  Star,
  Triangle,
  Heart,
  Zap,
  Search,
  Plus,
  Mouse,
  Palette,
  Upload,
  Layout,
  Layers
} from "lucide-react";

interface ElementLibraryProps {
  className?: string;
}

const ELEMENT_CATEGORIES = [
  {
    id: 'shapes',
    name: 'Shapes',
    icon: Square,
    elements: [
      { id: 'rectangle', name: 'Rectangle', icon: Square, type: 'rectangle' as const },
      { id: 'circle', name: 'Circle', icon: Circle, type: 'circle' as const },
      { id: 'triangle', name: 'Triangle', icon: Triangle, type: 'shape' as const },
      { id: 'star', name: 'Star', icon: Star, type: 'shape' as const },
      { id: 'heart', name: 'Heart', icon: Heart, type: 'shape' as const },
    ]
  },
  {
    id: 'text',
    name: 'Text',
    icon: Type,
    elements: [
      { id: 'heading', name: 'Heading', icon: Type, type: 'text' as const, props: { fontSize: 32, fontWeight: 'bold' } },
      { id: 'paragraph', name: 'Paragraph', icon: Type, type: 'text' as const, props: { fontSize: 16 } },
      { id: 'caption', name: 'Caption', icon: Type, type: 'text' as const, props: { fontSize: 12 } },
    ]
  },
  {
    id: 'ui',
    name: 'UI Elements',
    icon: Mouse,
    elements: [
      { id: 'button-primary', name: 'Primary Button', icon: Square, type: 'button' as const, props: { backgroundColor: '#8A2BE2' } },
      { id: 'button-secondary', name: 'Secondary Button', icon: Square, type: 'button' as const, props: { backgroundColor: '#6B7280' } },
      { id: 'input', name: 'Input Field', icon: Square, type: 'rectangle' as const, props: { backgroundColor: '#ffffff', border: { width: 1, color: '#d1d5db', style: 'solid', radius: 4 } } },
    ]
  },
  {
    id: 'media',
    name: 'Media',
    icon: ImageIcon,
    elements: [
      { id: 'image', name: 'Image', icon: ImageIcon, type: 'image' as const },
      { id: 'video', name: 'Video', icon: Square, type: 'rectangle' as const, props: { backgroundColor: '#000000' } },
    ]
  }
];

export const ElementLibrary: React.FC<ElementLibraryProps> = ({ className = "" }) => {
  const { addElement } = useCanvas();
  const [activeCategory, setActiveCategory] = useState('shapes');
  const [searchQuery, setSearchQuery] = useState('');

  const activeElements = ELEMENT_CATEGORIES.find(cat => cat.id === activeCategory)?.elements || [];
  const filteredElements = activeElements.filter(element =>
    element.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddElement = (elementConfig: any) => {
    const defaultProps = {
      backgroundColor: '#e5e7eb',
      opacity: 1,
      text: elementConfig.type === 'text' ? 'New Text' : elementConfig.type === 'button' ? 'Button' : undefined,
      fontSize: elementConfig.props?.fontSize || (elementConfig.type === 'text' ? 16 : undefined),
      fontWeight: elementConfig.props?.fontWeight || 'normal',
      textColor: elementConfig.type === 'text' ? '#000000' : elementConfig.type === 'button' ? '#ffffff' : undefined,
      textAlign: 'center' as const,
      border: elementConfig.props?.border || undefined,
      ...elementConfig.props
    };

    const element = {
      type: elementConfig.type,
      x: 100,
      y: 100,
      width: elementConfig.type === 'text' ? 200 : elementConfig.type === 'button' ? 120 : 100,
      height: elementConfig.type === 'text' ? 50 : elementConfig.type === 'button' ? 40 : 100,
      rotation: 0,
      visible: true,
      locked: false,
      name: elementConfig.name,
      props: defaultProps
    };

    addElement(element);
  };

  return (
    <div className={`w-80 bg-[#1E1E2E] border-r border-[#2B2B3D] flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-[#2B2B3D]">
        <h2 className="text-lg font-semibold text-white mb-3">Elements</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#2B2B3D] border-[#3B3B4D] text-white placeholder:text-gray-400 h-9"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 pb-2">
          <div className="grid grid-cols-2 gap-2">
            {ELEMENT_CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className={`justify-start gap-2 h-10 ${
                    isActive 
                      ? 'bg-[#8A2BE2] text-white hover:bg-[#7A1BCF]' 
                      : 'text-gray-300 hover:text-white hover:bg-[#2B2B3D] bg-transparent'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Elements Grid */}
        <ScrollArea className="flex-1 px-4">
          <div className="grid grid-cols-2 gap-3 pb-4">
            {filteredElements.map((element) => {
              const IconComponent = element.icon;
              
              return (
                <Card 
                  key={element.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg bg-[#2B2B3D] border-[#3B3B4D] hover:border-[#8A2BE2] group"
                  onClick={() => handleAddElement(element)}
                >
                  <CardContent className="p-3 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-[#3B3B4D] rounded-lg flex items-center justify-center mb-2 group-hover:bg-[#8A2BE2] transition-colors">
                      <IconComponent className="w-6 h-6 text-gray-300 group-hover:text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white">
                      {element.name}
                    </span>
                    <Plus className="w-3 h-3 text-gray-500 mt-1 group-hover:text-[#8A2BE2]" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredElements.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No elements found</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-[#2B2B3D] space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start gap-2 border-[#3B3B4D] text-gray-300 hover:text-white hover:bg-[#2B2B3D]"
        >
          <Upload className="w-4 h-4" />
          Upload Media
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start gap-2 border-[#3B3B4D] text-gray-300 hover:text-white hover:bg-[#2B2B3D]"
        >
          <Layout className="w-4 h-4" />
          Templates
        </Button>
      </div>
    </div>
  );
};
