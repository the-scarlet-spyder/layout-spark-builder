
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, Copy } from "lucide-react";
import { Link } from "react-router-dom";

const exampleTemplates = [
  {
    id: 1,
    name: "SaaS Startup",
    description: "Perfect for software companies and tech startups",
    image: "/placeholder.svg",
    features: ["Hero section", "Feature highlights", "Pricing table", "Contact form"],
    preview: "https://example.com/saas-preview"
  },
  {
    id: 2,
    name: "Agency Portfolio",
    description: "Showcase your creative work and services",
    image: "/placeholder.svg",
    features: ["Portfolio gallery", "Team section", "Service overview", "Testimonials"],
    preview: "https://example.com/agency-preview"
  },
  {
    id: 3,
    name: "Product Launch",
    description: "Launch your product with style and conversion focus",
    image: "/placeholder.svg",
    features: ["Product showcase", "Benefits list", "Social proof", "Pre-order form"],
    preview: "https://example.com/product-preview"
  },
  {
    id: 4,
    name: "Event Landing",
    description: "Drive registrations for your next event",
    image: "/placeholder.svg",
    features: ["Event details", "Speaker lineup", "Schedule", "Registration form"],
    preview: "https://example.com/event-preview"
  },
  {
    id: 5,
    name: "Course Sales",
    description: "Sell online courses and digital products",
    image: "/placeholder.svg",
    features: ["Course overview", "Curriculum", "Instructor bio", "Enrollment form"],
    preview: "https://example.com/course-preview"
  },
  {
    id: 6,
    name: "Local Business",
    description: "Perfect for restaurants, shops, and local services",
    image: "/placeholder.svg",
    features: ["Location info", "Services", "Hours", "Contact details"],
    preview: "https://example.com/local-preview"
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
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover rounded-t-lg"
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
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Copy className="w-4 h-4 mr-1" />
                    Use Template
                  </Button>
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
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Browse More Templates
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Examples;
