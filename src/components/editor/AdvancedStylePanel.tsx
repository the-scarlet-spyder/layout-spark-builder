
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

interface AdvancedStylePanelProps {
  selectedBlock: any;
  currentViewport: 'desktop' | 'tablet' | 'mobile';
  onUpdateBlock: (block: any) => void;
}

export const AdvancedStylePanel: React.FC<AdvancedStylePanelProps> = ({
  selectedBlock,
  currentViewport,
  onUpdateBlock
}) => {
  if (!selectedBlock) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Select a block to edit its properties</p>
      </div>
    );
  }

  const getResponsiveKey = (property: string) => {
    const prefixes = { mobile: 'sm:', tablet: 'md:', desktop: '' };
    return `${prefixes[currentViewport]}${property}`;
  };

  const updateResponsiveStyle = (property: string, value: string) => {
    const key = getResponsiveKey(property);
    const updatedBlock = {
      ...selectedBlock,
      styles: {
        ...selectedBlock.styles,
        responsive: {
          ...selectedBlock.styles.responsive,
          [currentViewport]: {
            ...selectedBlock.styles.responsive?.[currentViewport],
            [property]: value
          }
        }
      }
    };
    onUpdateBlock(updatedBlock);
  };

  const updateStyle = (key: string, value: string) => {
    const updatedBlock = {
      ...selectedBlock,
      styles: {
        ...selectedBlock.styles,
        [key]: value
      }
    };
    onUpdateBlock(updatedBlock);
  };

  const currentResponsiveStyles = selectedBlock.styles?.responsive?.[currentViewport] || {};

  return (
    <div className="space-y-4 h-full overflow-hidden">
      <div className="text-sm font-medium text-gray-600 mb-2">
        Editing for: <span className="capitalize font-semibold">{currentViewport}</span>
      </div>
      
      <Tabs defaultValue="spacing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="typography">Text</TabsTrigger>
          <TabsTrigger value="background">BG</TabsTrigger>
          <TabsTrigger value="borders">Border</TabsTrigger>
        </TabsList>
        
        <TabsContent value="spacing" className="space-y-4 max-h-80 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Padding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Top</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentResponsiveStyles.paddingTop || ''}
                    onChange={(e) => updateResponsiveStyle('paddingTop', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Right</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentResponsiveStyles.paddingRight || ''}
                    onChange={(e) => updateResponsiveStyle('paddingRight', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Bottom</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentResponsiveStyles.paddingBottom || ''}
                    onChange={(e) => updateResponsiveStyle('paddingBottom', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Left</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentResponsiveStyles.paddingLeft || ''}
                    onChange={(e) => updateResponsiveStyle('paddingLeft', e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Margin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Top</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentResponsiveStyles.marginTop || ''}
                    onChange={(e) => updateResponsiveStyle('marginTop', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Right</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentResponsiveStyles.marginRight || ''}
                    onChange={(e) => updateResponsiveStyle('marginRight', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Bottom</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentResponsiveStyles.marginBottom || ''}
                    onChange={(e) => updateResponsiveStyle('marginBottom', e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Left</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentResponsiveStyles.marginLeft || ''}
                    onChange={(e) => updateResponsiveStyle('marginLeft', e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4 max-h-80 overflow-y-auto">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label className="text-xs">Font Size</Label>
                <select
                  value={currentResponsiveStyles.fontSize || ''}
                  onChange={(e) => updateResponsiveStyle('fontSize', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Default</option>
                  <option value="text-xs">Extra Small</option>
                  <option value="text-sm">Small</option>
                  <option value="text-base">Base</option>
                  <option value="text-lg">Large</option>
                  <option value="text-xl">Extra Large</option>
                  <option value="text-2xl">2X Large</option>
                  <option value="text-3xl">3X Large</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">Font Weight</Label>
                <select
                  value={currentResponsiveStyles.fontWeight || ''}
                  onChange={(e) => updateResponsiveStyle('fontWeight', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Default</option>
                  <option value="font-thin">Thin</option>
                  <option value="font-light">Light</option>
                  <option value="font-normal">Normal</option>
                  <option value="font-medium">Medium</option>
                  <option value="font-semibold">Semibold</option>
                  <option value="font-bold">Bold</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">Text Color</Label>
                <Input
                  type="color"
                  value={selectedBlock.styles.color || '#000000'}
                  onChange={(e) => updateStyle('color', e.target.value)}
                  className="h-8"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="background" className="space-y-4 max-h-80 overflow-y-auto">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label className="text-xs">Background Color</Label>
                <Input
                  type="color"
                  value={selectedBlock.styles.backgroundColor || '#ffffff'}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                  className="h-8"
                />
              </div>

              <div>
                <Label className="text-xs">Background Image URL</Label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={selectedBlock.styles.backgroundImage || ''}
                  onChange={(e) => updateStyle('backgroundImage', e.target.value)}
                  className="h-8"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="borders" className="space-y-4 max-h-80 overflow-y-auto">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label className="text-xs">Border Width</Label>
                <Slider
                  value={[parseInt(selectedBlock.styles.borderWidth) || 0]}
                  onValueChange={(value) => updateStyle('borderWidth', `${value[0]}px`)}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {selectedBlock.styles.borderWidth || '0px'}
                </div>
              </div>

              <div>
                <Label className="text-xs">Border Color</Label>
                <Input
                  type="color"
                  value={selectedBlock.styles.borderColor || '#000000'}
                  onChange={(e) => updateStyle('borderColor', e.target.value)}
                  className="h-8"
                />
              </div>

              <div>
                <Label className="text-xs">Border Radius</Label>
                <Slider
                  value={[parseInt(selectedBlock.styles.borderRadius) || 0]}
                  onValueChange={(value) => updateStyle('borderRadius', `${value[0]}px`)}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {selectedBlock.styles.borderRadius || '0px'}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
