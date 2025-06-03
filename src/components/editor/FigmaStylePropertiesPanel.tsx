
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
import { 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Trash2, 
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react";

export const FigmaStylePropertiesPanel: React.FC = () => {
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

  const renderNoSelection = () => (
    <div className="p-6 text-center text-gray-500">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
        <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
      </div>
      <p className="text-sm">Select a layer to edit its properties</p>
    </div>
  );

  const renderElementHeader = () => (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {selectedElement?.type?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {selectedElement?.name || selectedElement?.type || 'Element'}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            onClick={() => updateSelectedElement('visible', !selectedElement?.visible)}
          >
            {selectedElement?.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            onClick={() => updateSelectedElement('locked', !selectedElement?.locked)}
          >
            {selectedElement?.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            onClick={deleteSelectedElements}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPositionSection = () => (
    <div className="p-4 space-y-4">
      <div>
        <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">Position</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">X</Label>
            <Input
              type="number"
              value={selectedElement?.x || 0}
              onChange={(e) => updateSelectedElement('x', parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Y</Label>
            <Input
              type="number"
              value={selectedElement?.y || 0}
              onChange={(e) => updateSelectedElement('y', parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">Dimensions</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">W</Label>
            <Input
              type="number"
              value={selectedElement?.width || 0}
              onChange={(e) => updateSelectedElement('width', parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">H</Label>
            <Input
              type="number"
              value={selectedElement?.height || 0}
              onChange={(e) => updateSelectedElement('height', parseInt(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">Rotation</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={selectedElement?.rotation || 0}
            onChange={(e) => updateSelectedElement('rotation', parseInt(e.target.value) || 0)}
            className="h-8 text-xs"
            placeholder="0°"
          />
          <span className="text-xs text-gray-500">°</span>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="p-4 space-y-4">
      <div>
        <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">Fill</Label>
        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={selectedElement?.props?.backgroundColor || '#ffffff'}
            onChange={(e) => updateSelectedElement('props.backgroundColor', e.target.value)}
            className="w-8 h-8 p-1 rounded border"
          />
          <Input
            value={selectedElement?.props?.backgroundColor || '#ffffff'}
            onChange={(e) => updateSelectedElement('props.backgroundColor', e.target.value)}
            className="flex-1 h-8 text-xs"
            placeholder="#ffffff"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">Opacity</Label>
        <div className="flex items-center gap-2">
          <Slider
            value={[(selectedElement?.props?.opacity || 1) * 100]}
            onValueChange={(value) => updateSelectedElement('props.opacity', value[0] / 100)}
            max={100}
            min={0}
            step={1}
            className="flex-1"
          />
          <Input
            type="number"
            value={Math.round((selectedElement?.props?.opacity || 1) * 100)}
            onChange={(e) => updateSelectedElement('props.opacity', (parseInt(e.target.value) || 0) / 100)}
            className="w-12 h-8 text-xs"
            max={100}
            min={0}
          />
          <span className="text-xs text-gray-500">%</span>
        </div>
      </div>

      <div>
        <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">Corner Radius</Label>
        <div className="grid grid-cols-4 gap-1">
          <Input
            type="number"
            value={selectedElement?.props?.border?.radius || 0}
            onChange={(e) => updateSelectedElement('props.border', {
              ...selectedElement?.props?.border,
              radius: parseInt(e.target.value) || 0
            })}
            className="h-8 text-xs"
            placeholder="0"
          />
          <Input
            type="number"
            value={selectedElement?.props?.border?.radius || 0}
            onChange={(e) => updateSelectedElement('props.border', {
              ...selectedElement?.props?.border,
              radius: parseInt(e.target.value) || 0
            })}
            className="h-8 text-xs"
            placeholder="0"
          />
          <Input
            type="number"
            value={selectedElement?.props?.border?.radius || 0}
            onChange={(e) => updateSelectedElement('props.border', {
              ...selectedElement?.props?.border,
              radius: parseInt(e.target.value) || 0
            })}
            className="h-8 text-xs"
            placeholder="0"
          />
          <Input
            type="number"
            value={selectedElement?.props?.border?.radius || 0}
            onChange={(e) => updateSelectedElement('props.border', {
              ...selectedElement?.props?.border,
              radius: parseInt(e.target.value) || 0
            })}
            className="h-8 text-xs"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );

  const renderTextSection = () => {
    if (selectedElement?.type !== 'text') return null;

    return (
      <div className="p-4 space-y-4">
        <div>
          <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">Content</Label>
          <Input
            value={selectedElement.props?.text || ''}
            onChange={(e) => updateSelectedElement('props.text', e.target.value)}
            className="h-8 text-xs"
            placeholder="Enter text..."
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Font size</Label>
            <Input
              type="number"
              value={selectedElement.props?.fontSize || 16}
              onChange={(e) => updateSelectedElement('props.fontSize', parseInt(e.target.value) || 16)}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Weight</Label>
            <Select
              value={String(selectedElement.props?.fontWeight || 'normal')}
              onValueChange={(value) => updateSelectedElement('props.fontWeight', value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Regular</SelectItem>
                <SelectItem value="500">Medium</SelectItem>
                <SelectItem value="600">Semibold</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">Color</Label>
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={selectedElement.props?.textColor || '#000000'}
              onChange={(e) => updateSelectedElement('props.textColor', e.target.value)}
              className="w-8 h-8 p-1 rounded border"
            />
            <Input
              value={selectedElement.props?.textColor || '#000000'}
              onChange={(e) => updateSelectedElement('props.textColor', e.target.value)}
              className="flex-1 h-8 text-xs"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2 block">Alignment</Label>
          <div className="flex gap-1">
            {['left', 'center', 'right'].map((align) => (
              <Button
                key={align}
                variant={selectedElement.props?.textAlign === align ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => updateSelectedElement('props.textAlign', align)}
              >
                {align === 'left' && <AlignLeft className="w-4 h-4" />}
                {align === 'center' && <AlignCenter className="w-4 h-4" />}
                {align === 'right' && <AlignRight className="w-4 h-4" />}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Design</h2>
        {hasSelection && (
          <Badge variant="secondary" className="text-xs">
            {selectedElements.length}
          </Badge>
        )}
      </div>
      
      {!hasSelection ? (
        renderNoSelection()
      ) : (
        <div className="flex-1 overflow-y-auto">
          {renderElementHeader()}
          
          <Tabs defaultValue="position" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
              <TabsTrigger value="position" className="text-xs">Position</TabsTrigger>
              <TabsTrigger value="appearance" className="text-xs">Design</TabsTrigger>
              <TabsTrigger value="text" className="text-xs">Text</TabsTrigger>
            </TabsList>

            <TabsContent value="position" className="m-0">
              {renderPositionSection()}
            </TabsContent>

            <TabsContent value="appearance" className="m-0">
              {renderAppearanceSection()}
            </TabsContent>

            <TabsContent value="text" className="m-0">
              {renderTextSection()}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};
