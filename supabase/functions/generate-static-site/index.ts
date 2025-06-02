
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Block {
  id: string;
  type: string;
  content: any;
  styles: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, customDomain } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch project data
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;

    // Generate HTML
    const html = generateHTML(project);
    
    // Generate subdomain
    const subdomain = customDomain || `${project.slug}.grid-app.site`;
    
    // For now, we'll return the HTML and subdomain
    // In production, this would deploy to a CDN/hosting service
    return new Response(
      JSON.stringify({ 
        html, 
        url: `https://${subdomain}`,
        success: true 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error generating site:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function generateHTML(project: any): string {
  const blocks = project.blocks || [];
  
  const blockHTML = blocks.map((block: Block) => {
    return generateBlockHTML(block);
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  ${blockHTML}
</body>
</html>`;
}

function generateBlockHTML(block: Block): string {
  const styles = block.styles || {};
  const styleClasses = generateTailwindClasses(styles);
  
  switch (block.type) {
    case 'navbar-logo':
    case 'navbar-text':
      return `<nav class="flex items-center justify-between ${styleClasses}" style="background-color: ${styles.backgroundColor || '#ffffff'}; padding: ${styles.padding || '1rem 2rem'};">
        <div class="flex items-center space-x-2">
          <span class="text-xl font-bold">${block.content.logoText || block.content.brandText || 'Brand'}</span>
        </div>
        <div class="flex items-center space-x-4">
          ${[1,2,3,4].map(i => `<a href="#" class="hover:text-gray-600">${block.content[`link${i}`] || ''}</a>`).join('')}
          <button class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">${block.content.ctaText || 'Get Started'}</button>
        </div>
      </nav>`;
      
    case 'hero':
      return `<section class="text-center ${styleClasses}" style="background-color: ${styles.backgroundColor || '#ffffff'}; padding: ${styles.padding || '4rem 2rem'};">
        <h1 class="text-4xl md:text-6xl font-bold mb-6" style="color: ${styles.color || '#000000'};">${block.content.title || 'Your Amazing Headline'}</h1>
        <p class="text-lg md:text-xl mb-8 text-gray-600">${block.content.subtitle || 'Compelling subtitle'}</p>
        <button class="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-purple-700">${block.content.buttonText || 'Get Started'}</button>
      </section>`;
      
    case 'text':
      return `<div class="${styleClasses}" style="background-color: ${styles.backgroundColor || '#ffffff'}; padding: ${styles.padding || '2rem'}; color: ${styles.color || '#000000'};">
        <p>${block.content.text || 'Text content'}</p>
      </div>`;
      
    case 'image':
      return `<div class="${styleClasses}" style="background-color: ${styles.backgroundColor || '#ffffff'}; padding: ${styles.padding || '2rem'};">
        <img src="${block.content.src || '/placeholder.svg'}" alt="${block.content.alt || 'Image'}" class="max-w-full h-auto">
      </div>`;
      
    case 'button':
      return `<div class="${styleClasses}" style="background-color: ${styles.backgroundColor || '#ffffff'}; padding: ${styles.padding || '2rem'};">
        <a href="${block.content.link || '#'}" class="inline-block bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700">${block.content.text || 'Click Me'}</a>
      </div>`;
      
    case 'footer':
      return `<footer class="bg-gray-900 text-white ${styleClasses}" style="padding: ${styles.padding || '3rem 2rem'};">
        <div class="grid md:grid-cols-4 gap-8">
          ${[1,2,3,4].map(col => `
            <div>
              <h3 class="font-semibold mb-4">${block.content[`col${col}Title`] || ''}</h3>
              <ul class="space-y-2">
                ${[1,2,3].map(link => `<li><a href="#" class="hover:text-gray-300">${block.content[`col${col}Link${link}`] || ''}</a></li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>${block.content.copyright || '© 2024 Your Company. All rights reserved.'}</p>
        </div>
      </footer>`;
      
    default:
      return `<div class="${styleClasses}" style="background-color: ${styles.backgroundColor || '#ffffff'}; padding: ${styles.padding || '2rem'};">
        <p>Unknown block type: ${block.type}</p>
      </div>`;
  }
}

function generateTailwindClasses(styles: any): string {
  const classes = [];
  
  if (styles.textAlign) {
    if (styles.textAlign === 'center') classes.push('text-center');
    if (styles.textAlign === 'left') classes.push('text-left');
    if (styles.textAlign === 'right') classes.push('text-right');
  }
  
  return classes.join(' ');
}
