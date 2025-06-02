import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModernSidebar } from "@/components/editor/ModernSidebar";
import { ModernTopBar } from "@/components/editor/ModernTopBar";
import { ModernCanvas } from "@/components/editor/ModernCanvas";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Json } from '@/integrations/supabase/types';

interface Project {
  id: string;
  name: string;
  slug: string;
  blocks: any[];
  is_published: boolean;
  published_url?: string | null;
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
        published_url: data.published_url || null
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
      <div className="min-h-screen bg-[#1E1E2E] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8A2BE2]"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#1E1E2E] flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Project not found</h2>
          <p className="text-gray-400">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#141419] text-white">
      {/* Top Navigation */}
      <ModernTopBar
        project={project}
        isEditingName={isEditingName}
        onToggleEditName={() => setIsEditingName(!isEditingName)}
        onProjectNameChange={(name) => setProject({ ...project, name })}
        canvasBlocks={canvasBlocks}
        currentViewport={currentViewport}
        onViewportChange={setCurrentViewport}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        saving={saving}
        onSave={() => saveProject()}
        onPublish={publishProject}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <ModernSidebar
          selectedBlock={selectedBlock}
          onAddBlock={addBlockToCanvas}
          onUpdateBlock={(updatedBlock) => {
            setCanvasBlocks(blocks => 
              blocks.map(block => 
                block.id === updatedBlock.id ? updatedBlock : block
              )
            );
          }}
          templates={templates}
          onLoadTemplate={loadTemplate}
          project={project}
          blocks={canvasBlocks}
          currentViewport={currentViewport}
          useAdvancedStyles={useAdvancedStyles}
          onToggleAdvancedStyles={() => setUseAdvancedStyles(!useAdvancedStyles)}
        />

        {/* Canvas */}
        <ModernCanvas
          blocks={canvasBlocks}
          onSelectBlock={setSelectedBlock}
          selectedBlock={selectedBlock}
          isPreviewMode={isPreviewMode}
          onUpdateBlocks={setCanvasBlocks}
          onAddBlock={addBlockToCanvas}
          currentViewport={currentViewport}
        />
      </div>
    </div>
  );
}
