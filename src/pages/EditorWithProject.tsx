
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CanvasProvider } from '@/contexts/CanvasContext';
import { EnhancedTopBar } from "@/components/editor/EnhancedTopBar";
import { EnhancedCanvas } from "@/components/editor/EnhancedCanvas";
import { ModernSidebar } from "@/components/editor/ModernSidebar";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

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

function EditorContent() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [useAdvancedStyles, setUseAdvancedStyles] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (project) {
        saveProject(true); // Silent save
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [project]);

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
        is_published: data.is_published || false,
        published_url: data.published_url || null
      };
      
      setProject(projectData);
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
          blocks: project.blocks
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

  // Legacy block functions for backwards compatibility
  const addBlockToCanvas = (blockType: string) => {
    // This will be handled by the new canvas system
    console.log('Legacy addBlockToCanvas called with:', blockType);
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Convert template blocks to canvas elements
      console.log('Loading template:', template);
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
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
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

        {/* Canvas */}
        <EnhancedCanvas isPreviewMode={isPreviewMode} />
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
