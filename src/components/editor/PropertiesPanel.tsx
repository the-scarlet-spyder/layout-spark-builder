
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PropertiesPanel = ({ selectedBlock, onUpdateBlock }) => {
  if (!selectedBlock) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Select a block to edit its properties</p>
      </div>
    );
  }

  const updateContent = (key, value) => {
    const updatedBlock = {
      ...selectedBlock,
      content: {
        ...selectedBlock.content,
        [key]: value
      }
    };
    onUpdateBlock(updatedBlock);
  };

  const updateStyle = (key, value) => {
    const updatedBlock = {
      ...selectedBlock,
      styles: {
        ...selectedBlock.styles,
        [key]: value
      }
    };
    onUpdateBlock(updatedBlock);
  };

  const renderContentEditor = () => {
    switch (selectedBlock.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={selectedBlock.content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={selectedBlock.content.subtitle || ''}
                onChange={(e) => updateContent('subtitle', e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={selectedBlock.content.buttonText || ''}
                onChange={(e) => updateContent('buttonText', e.target.value)}
                placeholder="Button text"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div>
            <Label htmlFor="text">Text Content</Label>
            <Textarea
              id="text"
              value={selectedBlock.content.text || ''}
              onChange={(e) => updateContent('text', e.target.value)}
              placeholder="Enter text content"
              className="min-h-[100px]"
            />
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={selectedBlock.content.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
                placeholder="Button text"
              />
            </div>
            <div>
              <Label htmlFor="link">Link URL</Label>
              <Input
                id="link"
                value={selectedBlock.content.link || ''}
                onChange={(e) => updateContent('link', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={selectedBlock.content.src || ''}
                onChange={(e) => updateContent('src', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="altText">Alt Text</Label>
              <Input
                id="altText"
                value={selectedBlock.content.alt || ''}
                onChange={(e) => updateContent('alt', e.target.value)}
                placeholder="Describe the image"
              />
            </div>
          </div>
        );

      default:
        return <p className="text-gray-500">No content options for this block type</p>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderContentEditor()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Styling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <Input
              id="backgroundColor"
              type="color"
              value={selectedBlock.styles.backgroundColor || '#ffffff'}
              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="textColor">Text Color</Label>
            <Input
              id="textColor"
              type="color"
              value={selectedBlock.styles.color || '#000000'}
              onChange={(e) => updateStyle('color', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="padding">Padding</Label>
            <Input
              id="padding"
              value={selectedBlock.styles.padding || '2rem'}
              onChange={(e) => updateStyle('padding', e.target.value)}
              placeholder="2rem"
            />
          </div>

          <div>
            <Label htmlFor="textAlign">Text Alignment</Label>
            <select
              id="textAlign"
              value={selectedBlock.styles.textAlign || 'center'}
              onChange={(e) => updateStyle('textAlign', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
