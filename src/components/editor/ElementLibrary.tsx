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
  Layers,
  Globe,
  Menu,
  Mail
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
    id: 'blocks',
    name: 'Blocks',
    icon: Layout,
    elements: [
      { 
        id: 'hero-section', 
        name: 'Hero Section', 
        icon: Globe, 
        type: 'block' as const,
        blockType: 'hero',
        props: { 
          backgroundColor: '#1f2937',
          width: 800,
          height: 400
        }
      },
      { 
        id: 'navbar', 
        name: 'Navigation Bar', 
        icon: Menu, 
        type: 'block' as const,
        blockType: 'navbar',
        props: { 
          backgroundColor: '#ffffff',
          width: 800,
          height: 60
        }
      },
      { 
        id: 'footer', 
        name: 'Footer', 
        icon: Layout, 
        type: 'block' as const,
        blockType: 'footer',
        props: { 
          backgroundColor: '#374151',
          width: 800,
          height: 200
        }
      },
      { 
        id: 'contact-form', 
        name: 'Contact Form', 
        icon: Mail, 
        type: 'block' as const,
        blockType: 'contact',
        props: { 
          backgroundColor: '#f9fafb',
          width: 400,
          height: 300
        }
      }
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
  const [activeCategory, setActiveCategory] = useState('blocks');
  const [searchQuery, setSearchQuery] = useState('');

  const activeElements = ELEMENT_CATEGORIES.find(cat => cat.id === activeCategory)?.elements || [];
  const filteredElements = activeElements.filter(element =>
    element.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createBlockElements = (blockType: string, x: number, y: number) => {
    const elements = [];
    
    switch (blockType) {
      case 'hero':
        // Background container
        elements.push({
          type: 'rectangle' as const,
          x, y,
          width: 800,
          height: 400,
          rotation: 0,
          visible: true,
          locked: false,
          name: 'Hero Background',
          props: {
            backgroundColor: '#1f2937',
            opacity: 1
          }
        });
        
        // Hero title
        elements.push({
          type: 'text' as const,
          x: x + 100,
          y: y + 120,
          width: 600,
          height: 80,
          rotation: 0,
          visible: true,
          locked: false,
          name: 'Hero Title',
          props: {
            text: 'Build Something Amazing',
            fontSize: 48,
            fontWeight: 'bold',
            textColor: '#ffffff',
            textAlign: 'center' as const,
            opacity: 1
          }
        });
        
        // Hero subtitle
        elements.push({
          type: 'text' as const,
          x: x + 150,
          y: y + 220,
          width: 500,
          height: 50,
          rotation: 0,
          visible: true,
          locked: false,
          name: 'Hero Subtitle',
          props: {
            text: 'Create beautiful websites with our drag-and-drop editor',
            fontSize: 18,
            fontWeight: 'normal',
            textColor: '#d1d5db',
            textAlign: 'center' as const,
            opacity: 1
          }
        });
        
        // CTA Button
        elements.push({
          type: 'button' as const,
          x: x + 325,
          y: y + 300,
          width: 150,
          height: 50,
          rotation: 0,
          visible: true,
          locked: false,
          name: 'CTA Button',
          props: {
            text: 'Get Started',
            backgroundColor: '#8A2BE2',
            textColor: '#ffffff',
            fontSize: 16,
            fontWeight: '500',
            textAlign: 'center' as const,
            border: { width: 0, style: 'solid', color: '#8A2BE2', radius: 8 },
            opacity: 1
          }
        });
        break;
        
      case 'navbar':
        // Navbar background
        elements.push({
          type: 'rectangle' as const,
          x, y,
          width: 800,
          height: 60,
          rotation: 0,
          visible: true,
          locked: false,
          name: 'Navbar Background',
          props: {
            backgroundColor: '#ffffff',
            border: { width: 1, style: 'solid', color: '#e5e7eb', radius: 0 },
            opacity: 1
          }
        });
        
        // Logo
        elements.push({
          type: 'text' as const,
          x: x + 20,
          y: y + 15,
          width: 100,
          height: 30,
          rotation: 0,
          visible: true,
          locked: false,
          name: 'Logo',
          props: {
            text: 'Brand',
            fontSize: 24,
            fontWeight: 'bold',
            textColor: '#1f2937',
            textAlign: 'left' as const,
            opacity: 1
          }
        });
        
        // Nav links
        const navItems = ['Home', 'About', 'Services', 'Contact'];
        navItems.forEach((item, index) => {
          elements.push({
            type: 'text' as const,
            x: x + 500 + (index * 80),
            y: y + 20,
            width: 70,
            height: 20,
            rotation: 0,
            visible: true,
            locked: false,
            name: `Nav ${item}`,
            props: {
              text: item,
              fontSize: 16,
              fontWeight: 'normal',
              textColor: '#6b7280',
              textAlign: 'center' as const,
              opacity: 1
            }
          });
        });
        break;
        
      case 'footer':
        // Footer background
        elements.push({
          type: 'rectangle' as const,
          x, y,
          width: 800,
          height: 200,
          rotation: 0,
          visible: true,
          locked: false,
          name: 'Footer Background',
          props: {
            backgroundColor: '#374151',
            opacity: 1
          }
        });
        
        // Footer content
        elements.push({
          type: 'text' as const,
          x: x + 50,
          y: y + 30,
          width: 200,
          height: 30,
          rotation: 0,
          visible: true,
          locked: false,
          name: 'Footer Title',
          props: {
            text: 'Your Company',
            fontSize: 20,
            fontWeight: 'bold',
            textColor: '#ffffff',
            textAlign: 'left' as const,
            opacity: 1
          }
        });
        
        elements.push({
          type: 'text' as const,
          x: x + 50,
          y: y + 70,
          width: 300,
          height: 80,
          rotation: 0,
          visible: true,
          locked: false,
          name: 'Footer Description',
          props: {
            text: 'Building amazing experiences for our customers worldwide.',
            fontSize: 14,
            fontWeight: 'normal',
            textColor: '#d1d5db',
            textAlign: 'left' as const,
            opacity: 1
          }
        });
        
        elements.push({
          type: 'text' as const,
          x: x + 250,
          y: y + 160,
          width: 300,
          height: 20,
          rotation: 0,
          visible: true,
          locked: false,
          name: 'Copyright',
          props: {
            text: '© 2024 Your Company. All rights reserved.',
            fontSize: 12,
            fontWeight: 'normal',
            textColor: '#9ca3af',
            textAlign: 'center' as const,
            opacity: 1
          }
        });
        break;
        
      case 'contact':
        // Form background
        elements.push({
          type: 'rectangle' as const,
          x, y,
          width: 400,
          height: 300,
          rotation: 0,
          visible: true,
          locked: false,
          name: 'Form Background',
          props: {
            backgroundColor: '#f9fafb',
            border: { width: 1, style: 'solid', color: '#e5e7eb', radius: 8 },
            opacity: 1
          }
        });
        
        // Form title
        elements.push({
          type: 'text' as const,
          x: x + 20,
          y: y + 20,
          width: 360,
          height: 30,
          rotation: 0,
          visible: true,
          locked: false,
          name: 'Form Title',
          props: {
            text: 'Contact Us',
            fontSize: 24,
            fontWeight: 'bold',
            textColor: '#1f2937',
            textAlign: 'center' as const,
            opacity: 1
          }
        });
        
        // Input fields
        ['Name', 'Email', 'Message'].forEach((label, index) => {
          const inputY = y + 70 + (index * 60);
          const inputHeight = label === 'Message' ? 80 : 40;
          
          elements.push({
            type: 'rectangle' as const,
            x: x + 20,
            y: inputY,
            width: 360,
            height: inputHeight,
            rotation: 0,
            visible: true,
            locked: false,
            name: `${label} Input`,
            props: {
              backgroundColor: '#ffffff',
              border: { width: 1, style: 'solid', color: '#d1d5db', radius: 4 },
              opacity: 1
            }
          });
          
          elements.push({
            type: 'text' as const,
            x: x + 30,
            y: inputY + 10,
            width: 100,
            height: 20,
            rotation: 0,
            visible: true,
            locked: false,
            name: `${label} Label`,
            props: {
              text: label,
              fontSize: 14,
              fontWeight: 'normal',
              textColor: '#6b7280',
              textAlign: 'left' as const,
              opacity: 1
            }
          });
        });
        
        // Submit button
        elements.push({
          type: 'button' as const,
          x: x + 20,
          y: y + 250,
          width: 360,
          height: 40,
          rotation: 0,
          visible: true,
          locked: false,
          name: 'Submit Button',
          props: {
            text: 'Send Message',
            backgroundColor: '#8A2BE2',
            textColor: '#ffffff',
            fontSize: 16,
            fontWeight: '500',
            textAlign: 'center' as const,
            border: { width: 0, style: 'solid', color: '#8A2BE2', radius: 6 },
            opacity: 1
          }
        });
        break;
    }
    
    return elements;
  };

  const handleAddElement = (elementConfig: any) => {
    if (elementConfig.type === 'block') {
      // Add multiple elements for block types
      const blockElements = createBlockElements(elementConfig.blockType, 100, 100);
      blockElements.forEach(element => {
        addElement(element);
      });
    } else {
      // Add single element
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
    }
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
