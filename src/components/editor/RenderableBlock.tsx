
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const RenderableBlock = ({ block, isPreviewMode }) => {
  const blockStyle = {
    backgroundColor: block.styles.backgroundColor,
    color: block.styles.color,
    padding: block.styles.padding,
    textAlign: block.styles.textAlign,
    fontSize: block.styles.fontSize
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'hero':
        return (
          <div style={blockStyle} className="py-16">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {block.content.title || 'Your Amazing Headline'}
              </h1>
              <p className="text-xl mb-8 opacity-90">
                {block.content.subtitle || 'Compelling subtitle that converts visitors into customers'}
              </p>
              <Button size="lg" className="text-lg px-8 py-6">
                {block.content.buttonText || 'Get Started'}
              </Button>
            </div>
          </div>
        );

      case 'text':
        return (
          <div style={blockStyle}>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg leading-relaxed">
                {block.content.text || 'Add your text content here. Click to edit and customize.'}
              </p>
            </div>
          </div>
        );

      case 'image':
        return (
          <div style={blockStyle}>
            <div className="max-w-4xl mx-auto">
              <img
                src={block.content.src || '/placeholder.svg'}
                alt={block.content.alt || 'Image'}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div style={blockStyle}>
            <div className="max-w-4xl mx-auto">
              <Button size="lg">
                {block.content.text || 'Click Me'}
              </Button>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div style={blockStyle}>
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">
                {block.content.title || 'Contact Us'}
              </h3>
              <form className="space-y-4">
                <Input placeholder="Your Name" />
                <Input type="email" placeholder="Your Email" />
                <Textarea placeholder="Your Message" className="min-h-[120px]" />
                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        );

      default:
        return (
          <div style={blockStyle}>
            <p>Unknown block type: {block.type}</p>
          </div>
        );
    }
  };

  return renderBlock();
};
