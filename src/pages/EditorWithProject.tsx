
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CanvasProvider, useCanvas } from '@/contexts/CanvasContext';
import { EnhancedTopBar } from "@/components/editor/EnhancedTopBar";
import { EnhancedCanvas } from "@/components/editor/EnhancedCanvas";
import { ModernSidebar } from "@/components/editor/ModernSidebar";
import { FigmaStylePropertiesPanel } from "@/components/editor/FigmaStylePropertiesPanel";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Share } from "lucide-react";

interface Project {
  id: string;
  name: string;
  slug: string;
  blocks: any[];
  canvas_data?: any;
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

function EditorContent() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { state, dispatch } = useCanvas();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [useAdvancedStyles, setUseAdvancedStyles] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  // Auto-save canvas data every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (project) {
        saveProject(true);
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [project, state]);

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
      
      const projectData: Project = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        blocks: Array.isArray(data.blocks) ? data.blocks : [],
        canvas_data: data.canvas_data || null,
        is_published: data.is_published || false,
        published_url: data.published_url || null
      };
      
      setProject(projectData);
      
      // Load canvas data if it exists
      if (projectData.canvas_data && Object.keys(projectData.canvas_data).length > 0) {
        dispatch({ type: 'LOAD_PROJECT', payload: projectData.canvas_data });
      }
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
          blocks: project.blocks,
          canvas_data: state,
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
          blocks: project.blocks,
          canvas_data: state
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

  const generateHTML = () => {
    const currentPage = state.project.pages.find(p => p.id === state.project.currentPageId);
    if (!currentPage) return '';

    const { frame, elements } = currentPage;
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project?.name || 'Generated Page'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .canvas-container {
            position: relative;
            width: ${frame.width}px;
            height: ${frame.height}px;
            background-color: ${frame.backgroundColor};
            margin: 0 auto;
            overflow: hidden;
        }
        
        .element {
            position: absolute;
        }
        
        .text-element {
            white-space: pre-wrap;
            word-break: break-word;
        }
        
        .button-element {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: none;
            outline: none;
        }
        
        .rectangle-element {
            /* Rectangle styles handled inline */
        }
        
        .circle-element {
            border-radius: 50%;
        }
        
        .image-element {
            object-fit: cover;
        }
    </style>
</head>
<body>
    <div class="canvas-container">`;

    // Sort elements by zIndex
    const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    sortedElements.forEach(element => {
      if (!element.visible) return;

      const commonStyles = `
        left: ${element.x}px;
        top: ${element.y}px;
        width: ${element.width}px;
        height: ${element.height}px;
        transform: rotate(${element.rotation}deg);
        opacity: ${element.props.opacity || 1};
        z-index: ${element.zIndex};
      `;

      const backgroundColor = element.props.backgroundColor || 'transparent';
      const border = element.props.border;
      const borderStyle = border ? `border: ${border.width}px ${border.style} ${border.color}; border-radius: ${border.radius}px;` : '';

      switch (element.type) {
        case 'text':
          html += `
        <div class="element text-element" style="${commonStyles} 
          color: ${element.props.textColor || '#000000'};
          font-size: ${element.props.fontSize || 16}px;
          font-weight: ${element.props.fontWeight || 'normal'};
          text-align: ${element.props.textAlign || 'left'};
          line-height: 1.4;
          ${borderStyle}
          background-color: ${backgroundColor};">
          ${element.props.text || ''}
        </div>`;
          break;

        case 'button':
          html += `
        <button class="element button-element" style="${commonStyles}
          background-color: ${backgroundColor};
          color: ${element.props.textColor || '#ffffff'};
          font-size: ${element.props.fontSize || 16}px;
          font-weight: ${element.props.fontWeight || 'normal'};
          ${borderStyle}">
          ${element.props.text || 'Button'}
        </button>`;
          break;

        case 'rectangle':
          html += `
        <div class="element rectangle-element" style="${commonStyles}
          background-color: ${backgroundColor};
          ${borderStyle}">
        </div>`;
          break;

        case 'circle':
          html += `
        <div class="element circle-element" style="${commonStyles}
          background-color: ${backgroundColor};
          ${borderStyle}">
        </div>`;
          break;

        case 'image':
          if (element.props.src) {
            html += `
        <img class="element image-element" style="${commonStyles}
          ${borderStyle}" 
          src="${element.props.src}" 
          alt="${element.props.alt || ''}" />`;
          }
          break;
      }
    });

    html += `
    </div>
</body>
</html>`;

    return html;
  };

  const downloadHTML = () => {
    const htmlContent = generateHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name || 'project'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "HTML file downloaded successfully",
    });
  };

  const addBlockToCanvas = (blockType: string) => {
    console.log('Legacy addBlockToCanvas called with:', blockType);
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      console.log('Loading template:', template);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Project not found</h2>
          <p className="text-gray-600">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <EnhancedTopBar
        project={project}
        isEditingName={isEditingName}
        onToggleEditName={() => setIsEditingName(!isEditingName)}
        onProjectNameChange={(name) => setProject({ ...project, name })}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        saving={saving}
        onSave={() => saveProject()}
        onPublish={publishProject}
        additionalActions={
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Share className="w-4 h-4" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Project</DialogTitle>
                <DialogDescription>
                  Download your project as HTML/CSS code
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Button
                  onClick={downloadHTML}
                  className="w-full gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download HTML File
                </Button>
                <p className="text-sm text-gray-600">
                  This will generate a complete HTML file with embedded CSS that you can use anywhere.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        <ModernSidebar
          selectedBlock={null}
          onAddBlock={addBlockToCanvas}
          onUpdateBlock={() => {}}
          templates={templates}
          onLoadTemplate={loadTemplate}
          project={project}
          blocks={project.blocks}
          currentViewport="desktop"
          useAdvancedStyles={useAdvancedStyles}
          onToggleAdvancedStyles={() => setUseAdvancedStyles(!useAdvancedStyles)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <EnhancedCanvas isPreviewMode={isPreviewMode} />
        </div>
        
        <FigmaStylePropertiesPanel />
      </div>
    </div>
  );
}

export default function EditorWithProject() {
  return (
    <CanvasProvider>
      <EditorContent />
    </CanvasProvider>
  );
}
