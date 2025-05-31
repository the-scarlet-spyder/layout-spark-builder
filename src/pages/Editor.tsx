import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Type, 
  Image, 
  Square, 
  Mail, 
  Play, 
  Save, 
  Eye,
  Palette,
  Settings,
  Plus,
  FileText,
  Edit2
} from "lucide-react";
import { DragDropCanvas } from "@/components/editor/DragDropCanvas";
import { BlockLibrary } from "@/components/editor/BlockLibrary";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { templates } from "@/data/templates";
import { useSearchParams } from "react-router-dom";

const Editor = () => {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [canvasBlocks, setCanvasBlocks] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [projectName, setProjectName] = useState('Landing Page');
  const [isEditingName, setIsEditingName] = useState(false);
  const [searchParams] = useSearchParams();

  // Load template if specified in URL
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setCanvasBlocks(template.blocks);
        setProjectName(template.name);
        console.log(`Loaded template: ${template.name}`);
      }
    }
  }, [searchParams]);

  const addBlockToCanvas = (blockType) => {
    const newBlock = {
      id: Date.now().toString(),
      type: blockType,
      content: getDefaultContent(blockType),
      styles: getDefaultStyles(blockType)
    };
    setCanvasBlocks([...canvasBlocks, newBlock]);
  };

  const loadTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCanvasBlocks(template.blocks);
      setSelectedBlock(null);
      setProjectName(template.name);
      console.log(`Template "${template.name}" loaded successfully`);
    }
  };

  const exportToHTML = () => {
    const htmlContent = generateHTMLExport(canvasBlocks);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateHTMLExport = (blocks) => {
    const blocksHTML = blocks.map(block => {
      const styles = `
        background-color: ${block.styles.backgroundColor};
        color: ${block.styles.color};
        padding: ${block.styles.padding};
        text-align: ${block.styles.textAlign};
        font-size: ${block.styles.fontSize};
      `;

      switch (block.type) {
        case 'hero':
          return `
            <section style="${styles}" class="hero-section">
              <div style="max-width: 1200px; margin: 0 auto;">
                <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1.5rem;">${block.content.title}</h1>
                <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">${block.content.subtitle}</p>
                <button style="background: #3b82f6; color: white; padding: 1rem 2rem; border: none; border-radius: 0.5rem; font-size: 1.125rem; cursor: pointer;">${block.content.buttonText}</button>
              </div>
            </section>
          `;
        case 'text':
          return `
            <section style="${styles}" class="text-section">
              <div style="max-width: 1200px; margin: 0 auto;">
                <p style="font-size: 1.125rem; line-height: 1.75;">${block.content.text}</p>
              </div>
            </section>
          `;
        case 'image':
          return `
            <section style="${styles}" class="image-section">
              <div style="max-width: 1200px; margin: 0 auto;">
                <img src="${block.content.src}" alt="${block.content.alt}" style="width: 100%; height: auto; border-radius: 0.5rem;" />
              </div>
            </section>
          `;
        case 'button':
          return `
            <section style="${styles}" class="button-section">
              <div style="max-width: 1200px; margin: 0 auto;">
                <a href="${block.content.link}" style="background: #3b82f6; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 0.5rem; font-size: 1.125rem; display: inline-block;">${block.content.text}</a>
              </div>
            </section>
          `;
        case 'contact':
          return `
            <section style="${styles}" class="contact-section">
              <div style="max-width: 600px; margin: 0 auto;">
                <h3 style="font-size: 2rem; font-weight: bold; margin-bottom: 2rem;">${block.content.title}</h3>
                <form style="display: flex; flex-direction: column; gap: 1rem;">
                  <input type="text" placeholder="Your Name" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem;" />
                  <input type="email" placeholder="Your Email" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem;" />
                  <textarea placeholder="Your Message" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; min-height: 120px;"></textarea>
                  <button type="submit" style="background: #3b82f6; color: white; padding: 1rem 2rem; border: none; border-radius: 0.5rem; font-size: 1.125rem; cursor: pointer;">Send Message</button>
                </form>
              </div>
            </section>
          `;
        default:
          return '';
      }
    }).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; }
    @media (max-width: 768px) {
      .hero-section h1 { font-size: 2rem !important; }
      .hero-section p { font-size: 1rem !important; }
      section { padding: 2rem 1rem !important; }
    }
  </style>
</head>
<body>
  ${blocksHTML}
</body>
</html>
    `;
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case 'navbar-logo':
        return {
          logoText: 'Brand',
          link1: 'Home',
          link2: 'About',
          link3: 'Services',
          link4: 'Contact',
          ctaText: 'Get Started'
        };
      case 'navbar-text':
        return {
          brandText: 'Company',
          link1: 'Home',
          link2: 'About',
          link3: 'Services',
          link4: 'Contact',
          ctaText: 'Get Started'
        };
      case 'footer':
        return {
          col1Title: 'Company',
          col1Link1: 'About Us',
          col1Link2: 'Careers',
          col1Link3: 'Contact',
          col2Title: 'Product',
          col2Link1: 'Features',
          col2Link2: 'Pricing',
          col2Link3: 'Documentation',
          col3Title: 'Support',
          col3Link1: 'Help Center',
          col3Link2: 'Community',
          col3Link3: 'Status',
          col4Title: 'Legal',
          col4Link1: 'Privacy',
          col4Link2: 'Terms',
          col4Link3: 'Cookies',
          copyright: '© 2024 Your Company. All rights reserved.'
        };
      case 'hero':
        return {
          title: 'Your Amazing Headline',
          subtitle: 'Compelling subtitle that converts visitors into customers',
          buttonText: 'Get Started'
        };
      case 'text':
        return {
          text: 'Add your text content here. Click to edit and customize.'
        };
      case 'image':
        return {
          src: '/placeholder.svg',
          alt: 'Placeholder image'
        };
      case 'button':
        return {
          text: 'Click Me',
          link: '#'
        };
      case 'contact':
        return {
          title: 'Contact Us',
          fields: ['name', 'email', 'message']
        };
      default:
        return {};
    }
  };

  const getDefaultStyles = (type) => {
    const baseStyles = {
      backgroundColor: '#ffffff',
      padding: '2rem',
      textAlign: 'center',
      fontSize: '1rem',
      color: '#000000'
    };

    switch (type) {
      case 'navbar-logo':
      case 'navbar-text':
        return {
          ...baseStyles,
          padding: '1rem 2rem',
          textAlign: 'left'
        };
      case 'footer':
        return {
          ...baseStyles,
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '3rem 2rem',
          textAlign: 'left'
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg">Page Builder</h2>
          <div className="flex gap-2 mt-3">
            <Button 
              variant={isPreviewMode ? "outline" : "default"} 
              size="sm"
              onClick={() => setIsPreviewMode(false)}
            >
              <Settings className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant={isPreviewMode ? "default" : "outline"} 
              size="sm"
              onClick={() => setIsPreviewMode(true)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="blocks" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 m-4">
            <TabsTrigger value="blocks">Blocks</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>
          
          <TabsContent value="blocks" className="flex-1 p-4 pt-0 overflow-y-auto">
            <BlockLibrary onAddBlock={addBlockToCanvas} />
          </TabsContent>

          <TabsContent value="templates" className="flex-1 p-4 pt-0 overflow-y-auto">
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-gray-600 uppercase tracking-wide">
                Templates
              </h3>
              {templates.map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => loadTemplate(template.id)}
                >
                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {template.description}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          {template.blocks.length} sections
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="properties" className="flex-1 p-4 pt-0 overflow-hidden">
            <PropertiesPanel 
              selectedBlock={selectedBlock}
              onUpdateBlock={(updatedBlock) => {
                setCanvasBlocks(blocks => 
                  blocks.map(block => 
                    block.id === updatedBlock.id ? updatedBlock : block
                  )
                );
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                className="font-semibold text-lg border-none p-0 h-auto focus:ring-0"
                autoFocus
              />
            ) : (
              <h1 
                className="font-semibold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center gap-2"
                onClick={() => setIsEditingName(true)}
              >
                {projectName}
                <Edit2 className="w-4 h-4 text-gray-400" />
              </h1>
            )}
            <span className="text-sm text-gray-500">({canvasBlocks.length} blocks)</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToHTML}>
              <Save className="w-4 h-4 mr-1" />
              Export HTML
            </Button>
            <Button size="sm">
              <Play className="w-4 h-4 mr-1" />
              Publish
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8">
          <DragDropCanvas 
            blocks={canvasBlocks}
            onSelectBlock={setSelectedBlock}
            selectedBlock={selectedBlock}
            isPreviewMode={isPreviewMode}
            onUpdateBlocks={setCanvasBlocks}
            onAddBlock={addBlockToCanvas}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
