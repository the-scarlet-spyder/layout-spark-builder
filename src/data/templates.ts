
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  blocks: any[];
}

export const saasStartupTemplate: Template = {
  id: 'saas-startup',
  name: 'SaaS Startup',
  description: 'Perfect for software companies and tech startups',
  category: 'business',
  blocks: [
    {
      id: '1',
      type: 'hero',
      content: {
        title: 'Revolutionary SaaS Platform',
        subtitle: 'Streamline your workflow with our cutting-edge software solution. Join thousands of companies already transforming their business.',
        buttonText: 'Start Free Trial'
      },
      styles: {
        backgroundColor: '#1e3a8a',
        color: '#ffffff',
        padding: '4rem',
        textAlign: 'center',
        fontSize: '1rem'
      }
    },
    {
      id: '2',
      type: 'text',
      content: {
        text: 'Trusted by over 10,000+ companies worldwide. Our platform helps businesses scale faster, reduce costs, and improve efficiency through automation and intelligent insights.'
      },
      styles: {
        backgroundColor: '#f8fafc',
        color: '#475569',
        padding: '3rem',
        textAlign: 'center',
        fontSize: '1.125rem'
      }
    },
    {
      id: '3',
      type: 'text',
      content: {
        text: '⚡ Lightning Fast Performance | 🔒 Enterprise Security | 📊 Advanced Analytics | 🌐 Global Scale'
      },
      styles: {
        backgroundColor: '#ffffff',
        color: '#1e293b',
        padding: '2rem',
        textAlign: 'center',
        fontSize: '1.25rem'
      }
    },
    {
      id: '4',
      type: 'image',
      content: {
        src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
        alt: 'SaaS Dashboard Preview'
      },
      styles: {
        backgroundColor: '#f1f5f9',
        color: '#000000',
        padding: '3rem',
        textAlign: 'center',
        fontSize: '1rem'
      }
    },
    {
      id: '5',
      type: 'text',
      content: {
        text: '🚀 Key Features That Drive Results'
      },
      styles: {
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '2rem',
        textAlign: 'center',
        fontSize: '2rem'
      }
    },
    {
      id: '6',
      type: 'text',
      content: {
        text: 'Automated Workflows - Save 10+ hours per week with intelligent automation that handles repetitive tasks and optimizes your business processes.'
      },
      styles: {
        backgroundColor: '#ffffff',
        color: '#374151',
        padding: '2rem',
        textAlign: 'left',
        fontSize: '1rem'
      }
    },
    {
      id: '7',
      type: 'text',
      content: {
        text: 'Real-time Analytics - Make data-driven decisions with comprehensive dashboards and insights that update in real-time across all your operations.'
      },
      styles: {
        backgroundColor: '#f9fafb',
        color: '#374151',
        padding: '2rem',
        textAlign: 'left',
        fontSize: '1rem'
      }
    },
    {
      id: '8',
      type: 'button',
      content: {
        text: 'Get Started - Free 14-Day Trial',
        link: '#signup'
      },
      styles: {
        backgroundColor: '#059669',
        color: '#ffffff',
        padding: '3rem',
        textAlign: 'center',
        fontSize: '1rem'
      }
    },
    {
      id: '9',
      type: 'contact',
      content: {
        title: 'Ready to Transform Your Business?',
        fields: ['name', 'email', 'company', 'message']
      },
      styles: {
        backgroundColor: '#1f2937',
        color: '#ffffff',
        padding: '4rem',
        textAlign: 'center',
        fontSize: '1rem'
      }
    }
  ]
};

export const templates: Template[] = [
  saasStartupTemplate
];
