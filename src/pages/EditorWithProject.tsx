import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, 
  Eye,
  Settings,
  Plus,
  FileText,
  Edit2,
  Globe,
  ArrowLeft,
  Palette
} from "lucide-react";
import { DragDropCanvas } from "@/components/editor/DragDropCanvas";
import { BlockLibrary } from "@/components/editor/BlockLibrary";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { AdvancedStylePanel } from "@/components/editor/AdvancedStylePanel";
import { ResponsiveControls } from "@/components/editor/ResponsiveControls";
import { PublishingPanel } from "@/components/editor/PublishingPanel";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Json } from '@/integrations/supabase/types';

interface Project {
  id: string;
  name: string;
  slug: string;
  blocks: any[];
  is_published: boolean;
  published_url?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  blocks: any[];
}

export default function EditorWithProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [canvasBlocks, setCanvasBlocks] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentViewport, setCurrentViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [useAdvancedStyles, setUseAdvancedStyles] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (project && canvasBlocks.length > 0) {
        saveProject(true); // Silent save
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [project, canvasBlocks]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
    fetchTemplates();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      
      // Convert Supabase data to our Project interface
      const projectData: Project = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        blocks: Array.isArray(data.blocks) ? data.blocks : [],
        is_published: data.is_published || false,
        published_url: data.published_url || undefined
      };
      
      setProject(projectData);
      setCanvasBlocks(projectData.blocks);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('name');

      if (error) throw error;
      
      // Convert Supabase data to our Template interface
      const templatesData: Template[] = (data || []).map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category,
        blocks: Array.isArray(template.blocks) ? template.blocks : []
      }));
      
      setTemplates(templatesData);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const saveProject = async (silent = false) => {
    if (!project) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: project.name,
          blocks: canvasBlocks,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;

      if (!silent) {
        toast({
          title: "Success",
          description: "Project saved successfully",
        });
      }
    } catch (error) {
      if (!silent) {
        toast({
          title: "Error",
          description: "Failed to save project",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const publishProject = async () => {
    if (!project) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          is_published: !project.is_published,
          published_at: project.is_published ? null : new Date().toISOString(),
          blocks: canvasBlocks
        })
        .eq('id', project.id);

      if (error) throw error;

      setProject({ ...project, is_published: !project.is_published });
      
      toast({
        title: "Success",
        description: project.is_published ? "Project unpublished" : "Project published successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish project",
        variant: "destructive",
      });
    }
  };

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
    }
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

  const getCanvasWidth = () => {
    switch (currentViewport) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-4xl';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="mb-3">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
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
          <TabsList className="grid w-full grid-cols-4 m-4">
            <TabsTrigger value="blocks">Blocks</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
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
                <div 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow p-3 border rounded-lg"
                  onClick={() => loadTemplate(template.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="properties" className="flex-1 p-4 pt-0 overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Properties Panel</h3>
                <Button
                  variant={useAdvancedStyles ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseAdvancedStyles(!useAdvancedStyles)}
                >
                  <Palette className="w-4 h-4 mr-1" />
                  {useAdvancedStyles ? 'Basic' : 'Advanced'}
                </Button>
              </div>
              
              {useAdvancedStyles ? (
                <AdvancedStylePanel 
                  selectedBlock={selectedBlock}
                  currentViewport={currentViewport}
                  onUpdateBlock={(updatedBlock) => {
                    setCanvasBlocks(blocks => 
                      blocks.map(block => 
                        block.id === updatedBlock.id ? updatedBlock : block
                      )
                    );
                  }}
                />
              ) : (
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
              )}
            </div>
          </TabsContent>

          <TabsContent value="publish" className="flex-1 p-4 pt-0 overflow-y-auto">
            <PublishingPanel project={project} blocks={canvasBlocks} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <Input
                  value={project.name}
                  onChange={(e) => setProject({ ...project, name: e.target.value })}
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
                  {project.name}
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </h1>
              )}
              <span className="text-sm text-gray-500">({canvasBlocks.length} blocks)</span>
            </div>
            
            <ResponsiveControls
              currentViewport={currentViewport}
              onViewportChange={setCurrentViewport}
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => saveProject()} disabled={saving}>
              <Save className="w-4 h-4 mr-1" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              size="sm" 
              onClick={publishProject}
              variant={project.is_published ? "outline" : "default"}
            >
              <Globe className="w-4 h-4 mr-1" />
              {project.is_published ? 'Unpublish' : 'Publish'}
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8">
          <div className={`mx-auto transition-all duration-300 ${getCanvasWidth()}`}>
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
    </div>
  );
}
