
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { RenderableBlock } from '@/components/editor/RenderableBlock';

interface Project {
  id: string;
  name: string;
  slug: string;
  blocks: any[];
  user_id: string;
}

export default function PublishedPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPublishedProject();
  }, [slug]);

  const fetchPublishedProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      
      // Convert Supabase data to our Project interface
      const projectData: Project = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        blocks: Array.isArray(data.blocks) ? data.blocks : [],
        user_id: data.user_id
      };
      
      setProject(projectData);
    } catch (error) {
      console.error('Failed to fetch published project:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist or has been unpublished.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Render the published page blocks */}
      {project.blocks.map((block) => (
        <RenderableBlock
          key={block.id}
          block={block}
          isPreviewMode={true}
          onUpdateBlock={() => {}}
        />
      ))}
    </div>
  );
}
