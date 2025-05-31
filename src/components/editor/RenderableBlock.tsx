
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
    fontSize: block.styles.fontSize,
    minHeight: '60px'
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'hero':
        return (
          <div style={blockStyle} className="py-16">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {block.content.title || 'Your Amazing Headline'}
              </h1>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                {block.content.subtitle || 'Compelling subtitle that converts visitors into customers'}
              </p>
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                {block.content.buttonText || 'Get Started'}
              </Button>
            </div>
          </div>
        );

      case 'text':
        return (
          <div style={blockStyle}>
            <div className="max-w-4xl mx-auto">
              <div 
                className="text-lg leading-relaxed"
                style={{ whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ 
                  __html: (block.content.text || 'Add your text content here. Click to edit and customize.').replace(/\n/g, '<br>') 
                }}
              />
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
                className="w-full h-auto rounded-lg shadow-lg max-h-96 object-cover"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div style={blockStyle}>
            <div className="max-w-4xl mx-auto">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-shadow"
                style={{ 
                  backgroundColor: block.styles.backgroundColor === '#ffffff' ? '#3b82f6' : 'inherit',
                  color: block.styles.backgroundColor === '#ffffff' ? '#ffffff' : 'inherit'
                }}
              >
                {block.content.text || 'Click Me'}
              </Button>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div style={blockStyle}>
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold mb-8">
                {block.content.title || 'Contact Us'}
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    placeholder="Your Name" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70" 
                  />
                  <Input 
                    type="email" 
                    placeholder="Your Email" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70" 
                  />
                </div>
                <Input 
                  placeholder="Company Name" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70" 
                />
                <Textarea 
                  placeholder="Tell us about your project..." 
                  className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-white/70" 
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full text-lg py-6 bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        );

      default:
        return (
          <div style={blockStyle}>
            <div className="max-w-4xl mx-auto">
              <p className="text-red-500">Unknown block type: {block.type}</p>
            </div>
          </div>
        );
    }
  };

  return renderBlock();
};
