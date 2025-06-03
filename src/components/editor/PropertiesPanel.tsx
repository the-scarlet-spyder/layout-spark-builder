
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCanvas } from "@/contexts/CanvasContext";
import { Lock, Unlock, Eye, EyeOff, Trash2 } from "lucide-react";

interface PropertiesPanelProps {
  className?: string;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ className = "" }) => {
  const { state, updateElement, deleteSelectedElements } = useCanvas();
  
  const currentPage = state.project.pages.find(p => p.id === state.project.currentPageId)!;
  const selectedElements = currentPage.elements.filter(el => state.selectedElementIds.includes(el.id));
  const selectedElement = selectedElements.length === 1 ? selectedElements[0] : null;
  const hasSelection = selectedElements.length > 0;

  const updateSelectedElement = (property: string, value: any) => {
    if (selectedElement) {
      if (property.startsWith('props.')) {
        const propKey = property.replace('props.', '');
        updateElement(selectedElement.id, {
          props: { ...selectedElement.props, [propKey]: value }
        });
      } else {
        updateElement(selectedElement.id, { [property]: value });
      }
    }
  };

  const renderFrameProperties = () => (
    <div className="space-y-4">
      <div className="text-center py-8 text-gray-400">
        <div className="w-16 h-16 bg-[#2B2B3D] rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-2 border-[#8A2BE2] rounded"></div>
        </div>
        <h3 className="text-lg font-medium mb-2 text-white">Canvas Properties</h3>
        <p className="text-sm">Frame size: {currentPage.frame.width} × {currentPage.frame.height}px</p>
      </div>
      
      <Card className="bg-[#2B2B3D] border-[#3B3B4D]">
        <CardHeader>
          <CardTitle className="text-white text-sm">Frame Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-300">Width</Label>
              <Input
                type="number"
                value={currentPage.frame.width}
                className="bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                readOnly
              />
            </div>
            <div>
              <Label className="text-xs text-gray-300">Height</Label>
              <Input
                type="number"
                value={currentPage.frame.height}
                className="bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                readOnly
              />
            </div>
          </div>
          
          <div>
            <Label className="text-xs text-gray-300">Background</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={currentPage.frame.backgroundColor}
                className="w-12 h-8 p-1 bg-[#1E1E2E] border-[#3B3B4D]"
                readOnly
              />
              <Input
                value={currentPage.frame.backgroundColor}
                className="flex-1 bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderElementProperties = () => (
    <div className="space-y-4">
      {/* Element Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-[#8A2BE2] text-white">
            {selectedElement?.type || 'Multiple'}
          </Badge>
          <span className="text-white text-sm font-medium">
            {selectedElements.length === 1 ? selectedElement?.name : `${selectedElements.length} elements`}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#3B3B4D]"
            onClick={() => updateSelectedElement('visible', !selectedElement?.visible)}
          >
            {selectedElement?.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#3B3B4D]"
            onClick={() => updateSelectedElement('locked', !selectedElement?.locked)}
          >
            {selectedElement?.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-[#3B3B4D]"
            onClick={deleteSelectedElements}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Separator className="border-[#3B3B4D]" />

      {/* Properties Tabs */}
      <Tabs defaultValue="position" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#2B2B3D]">
          <TabsTrigger value="position" className="text-xs">Position</TabsTrigger>
          <TabsTrigger value="appearance" className="text-xs">Style</TabsTrigger>
          <TabsTrigger value="typography" className="text-xs">Text</TabsTrigger>
        </TabsList>

        <TabsContent value="position" className="space-y-4 mt-4">
          <Card className="bg-[#2B2B3D] border-[#3B3B4D]">
            <CardHeader>
              <CardTitle className="text-white text-sm">Position & Size</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-300">X</Label>
                  <Input
                    type="number"
                    value={selectedElement?.x || 0}
                    onChange={(e) => updateSelectedElement('x', parseInt(e.target.value) || 0)}
                    className="bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Y</Label>
                  <Input
                    type="number"
                    value={selectedElement?.y || 0}
                    onChange={(e) => updateSelectedElement('y', parseInt(e.target.value) || 0)}
                    className="bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-300">Width</Label>
                  <Input
                    type="number"
                    value={selectedElement?.width || 0}
                    onChange={(e) => updateSelectedElement('width', parseInt(e.target.value) || 0)}
                    className="bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Height</Label>
                  <Input
                    type="number"
                    value={selectedElement?.height || 0}
                    onChange={(e) => updateSelectedElement('height', parseInt(e.target.value) || 0)}
                    className="bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-300">Rotation</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[selectedElement?.rotation || 0]}
                    onValueChange={(value) => updateSelectedElement('rotation', value[0])}
                    max={360}
                    min={0}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={selectedElement?.rotation || 0}
                    onChange={(e) => updateSelectedElement('rotation', parseInt(e.target.value) || 0)}
                    className="w-16 bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-300">Z-Index</Label>
                <Input
                  type="number"
                  value={selectedElement?.zIndex || 0}
                  onChange={(e) => updateSelectedElement('zIndex', parseInt(e.target.value) || 0)}
                  className="bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card className="bg-[#2B2B3D] border-[#3B3B4D]">
            <CardHeader>
              <CardTitle className="text-white text-sm">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-gray-300">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement?.props?.backgroundColor || '#ffffff'}
                    onChange={(e) => updateSelectedElement('props.backgroundColor', e.target.value)}
                    className="w-12 h-8 p-1 bg-[#1E1E2E] border-[#3B3B4D]"
                  />
                  <Input
                    value={selectedElement?.props?.backgroundColor || '#ffffff'}
                    onChange={(e) => updateSelectedElement('props.backgroundColor', e.target.value)}
                    className="flex-1 bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-300">Opacity</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[(selectedElement?.props?.opacity || 1) * 100]}
                    onValueChange={(value) => updateSelectedElement('props.opacity', value[0] / 100)}
                    max={100}
                    min={0}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-300 w-10">
                    {Math.round((selectedElement?.props?.opacity || 1) * 100)}%
                  </span>
                </div>
              </div>

              {selectedElement?.props?.border && (
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300">Border</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="number"
                        placeholder="Width"
                        value={selectedElement.props.border.width || 0}
                        onChange={(e) => updateSelectedElement('props.border', {
                          ...selectedElement.props.border,
                          width: parseInt(e.target.value) || 0
                        })}
                        className="bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                      />
                    </div>
                    <div>
                      <Input
                        type="color"
                        value={selectedElement.props.border.color || '#000000'}
                        onChange={(e) => updateSelectedElement('props.border', {
                          ...selectedElement.props.border,
                          color: e.target.value
                        })}
                        className="w-full h-8 p-1 bg-[#1E1E2E] border-[#3B3B4D]"
                      />
                    </div>
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Border Radius"
                      value={selectedElement.props.border.radius || 0}
                      onChange={(e) => updateSelectedElement('props.border', {
                        ...selectedElement.props.border,
                        radius: parseInt(e.target.value) || 0
                      })}
                      className="bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4 mt-4">
          {selectedElement?.type === 'text' && (
            <Card className="bg-[#2B2B3D] border-[#3B3B4D]">
              <CardHeader>
                <CardTitle className="text-white text-sm">Typography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-300">Text Content</Label>
                  <Input
                    value={selectedElement.props?.text || ''}
                    onChange={(e) => updateSelectedElement('props.text', e.target.value)}
                    className="bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                    placeholder="Enter text..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-300">Font Size</Label>
                    <Input
                      type="number"
                      value={selectedElement.props?.fontSize || 16}
                      onChange={(e) => updateSelectedElement('props.fontSize', parseInt(e.target.value) || 16)}
                      className="bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-300">Font Weight</Label>
                    <Select
                      value={String(selectedElement.props?.fontWeight || 'normal')}
                      onValueChange={(value) => updateSelectedElement('props.fontWeight', value)}
                    >
                      <SelectTrigger className="bg-[#1E1E2E] border-[#3B3B4D] text-white h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2B2B3D] border-[#3B3B4D]">
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="100">Thin</SelectItem>
                        <SelectItem value="300">Light</SelectItem>
                        <SelectItem value="500">Medium</SelectItem>
                        <SelectItem value="600">Semibold</SelectItem>
                        <SelectItem value="700">Bold</SelectItem>
                        <SelectItem value="900">Black</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-300">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={selectedElement.props?.textColor || '#000000'}
                      onChange={(e) => updateSelectedElement('props.textColor', e.target.value)}
                      className="w-12 h-8 p-1 bg-[#1E1E2E] border-[#3B3B4D]"
                    />
                    <Input
                      value={selectedElement.props?.textColor || '#000000'}
                      onChange={(e) => updateSelectedElement('props.textColor', e.target.value)}
                      className="flex-1 bg-[#1E1E2E] border-[#3B3B4D] text-white h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-300">Text Align</Label>
                  <Select
                    value={selectedElement.props?.textAlign || 'left'}
                    onValueChange={(value) => updateSelectedElement('props.textAlign', value)}
                  >
                    <SelectTrigger className="bg-[#1E1E2E] border-[#3B3B4D] text-white h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2B2B3D] border-[#3B3B4D]">
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="justify">Justify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className={`w-80 bg-[#1E1E2E] border-l border-[#2B2B3D] p-4 overflow-y-auto ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Properties</h2>
        {hasSelection && (
          <Badge variant="secondary" className="bg-[#8A2BE2] text-white text-xs">
            {selectedElements.length} selected
          </Badge>
        )}
      </div>
      
      {hasSelection ? renderElementProperties() : renderFrameProperties()}
    </div>
  );
};
