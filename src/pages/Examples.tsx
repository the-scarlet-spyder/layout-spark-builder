
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, Copy } from "lucide-react";
import { Link } from "react-router-dom";

const exampleTemplates = [
  {
    id: 'saas-startup',
    name: "SaaS Startup",
    description: "Perfect for software companies and tech startups",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop",
    features: ["Hero section with CTA", "Feature highlights", "Product showcase", "Contact form"],
    preview: "/editor?template=saas-startup&preview=true",
    use: "/editor?template=saas-startup"
  },
  {
    id: 'agency-portfolio',
    name: "Agency Portfolio",
    description: "Showcase your creative work and services",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    features: ["Portfolio gallery", "Team section", "Service overview", "Testimonials"],
    preview: "#",
    use: "/editor"
  },
  {
    id: 'product-launch',
    name: "Product Launch",
    description: "Launch your product with style and conversion focus",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
    features: ["Product showcase", "Benefits list", "Social proof", "Pre-order form"],
    preview: "#",
    use: "/editor"
  },
  {
    id: 'event-landing',
    name: "Event Landing",
    description: "Drive registrations for your next event",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    features: ["Event details", "Speaker lineup", "Schedule", "Registration form"],
    preview: "#",
    use: "/editor"
  },
  {
    id: 'course-sales',
    name: "Course Sales",
    description: "Sell online courses and digital products",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
    features: ["Course overview", "Curriculum", "Instructor bio", "Enrollment form"],
    preview: "#",
    use: "/editor"
  },
  {
    id: 'local-business',
    name: "Local Business",
    description: "Perfect for restaurants, shops, and local services",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop",
    features: ["Location info", "Services", "Hours", "Contact details"],
    preview: "#",
    use: "/editor"
  }
];

const Examples = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Template Examples</h1>
            </div>
            <Link to="/editor">
              <Button>
                Start Building
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Landing Page Templates
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our collection of professionally designed templates. 
            Each template is fully customizable and mobile-responsive.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exampleTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="aspect-video rounded-t-lg overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{template.name}</CardTitle>
                <CardDescription className="text-gray-600 mb-4">
                  {template.description}
                </CardDescription>
                
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Includes:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {template.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Link to={template.preview} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </Link>
                  <Link to={template.use} className="flex-1">
                    <Button size="sm" className="w-full">
                      <Copy className="w-4 h-4 mr-1" />
                      Use Template
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-12 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Create Your Own?
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Start with a template or build from scratch using our intuitive drag-and-drop editor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/editor">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Building Now
                </Button>
              </Link>
              <Link to="/editor?template=saas-startup">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Try SaaS Template
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Examples;
