
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Palette, Code, Globe, Smartphone, Users, Grid3X3, Layers, Mouse } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-4 border-b border-gray-800">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Grid</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/templates">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                Templates
              </Button>
            </Link>
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button className="bg-purple-600 hover:bg-purple-700">Sign In</Button>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-purple-600/10 border border-purple-600/20 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Powered by modern web technology</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Just publish it
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              with Grid
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Design, build, and publish stunning landing pages in minutes. 
            No code required, just pure creativity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700">
                  Start Building Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
            <Link to="/templates">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                Browse Templates
              </Button>
            </Link>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="w-full h-24 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="w-3/4 h-3 bg-gray-700 rounded"></div>
                    <div className="w-1/2 h-3 bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="w-full h-24 bg-gradient-to-r from-green-600/30 to-purple-600/30 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="w-3/4 h-3 bg-gray-700 rounded"></div>
                    <div className="w-1/2 h-3 bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="w-full h-24 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="w-3/4 h-3 bg-gray-700 rounded"></div>
                    <div className="w-1/2 h-3 bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Not everything powerful
            <br />
            <span className="text-gray-400">has to look complicated</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Grid combines the power of professional design tools with the simplicity your team needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-gray-900 border-gray-800 hover:border-purple-600/50 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Mouse className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-xl text-white">Drag & Drop Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Intuitive visual editor with pre-built blocks. Simply drag, drop, and customize to create your perfect page.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-purple-600/50 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-xl text-white">Custom Styling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Full control over colors, fonts, spacing, and layout. Make every element match your brand perfectly.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-purple-600/50 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-xl text-white">Mobile Responsive</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Your pages automatically adapt to any screen size. Perfect on desktop, tablet, and mobile devices.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-purple-600/50 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-xl text-white">Clean Code Export</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Export your designs as clean HTML/CSS code or publish directly to a custom URL.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-purple-600/50 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-xl text-white">Instant Publishing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Publish your pages instantly with a custom URL. Share your creations with the world in seconds.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-purple-600/50 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-xl text-white">Project Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Manage multiple projects, save templates, and organize all your landing pages in one place.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Simple to Learn Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple to learn,
              <br />
              <span className="text-gray-400">easy to master</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Grid's intuitive interface means you can start creating professional landing pages 
              from day one. No steep learning curve, just results.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300">Start with professional templates</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300">Customize with visual controls</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300">Publish with one click</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-2xl"></div>
            <div className="relative bg-gray-900 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="w-full h-16 bg-gradient-to-r from-purple-600/40 to-pink-600/40 rounded mb-2"></div>
                  <div className="space-y-1">
                    <div className="w-full h-2 bg-gray-700 rounded"></div>
                    <div className="w-3/4 h-2 bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="w-full h-16 bg-gradient-to-r from-blue-600/40 to-purple-600/40 rounded mb-2"></div>
                  <div className="space-y-1">
                    <div className="w-full h-2 bg-gray-700 rounded"></div>
                    <div className="w-3/4 h-2 bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="w-full h-16 bg-gradient-to-r from-green-600/40 to-blue-600/40 rounded mb-2"></div>
                  <div className="space-y-1">
                    <div className="w-full h-2 bg-gray-700 rounded"></div>
                    <div className="w-3/4 h-2 bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="w-full h-16 bg-gradient-to-r from-orange-600/40 to-red-600/40 rounded mb-2"></div>
                  <div className="space-y-1">
                    <div className="w-full h-2 bg-gray-700 rounded"></div>
                    <div className="w-3/4 h-2 bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-600/20 rounded-3xl p-12 text-center backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ship like the
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                future of design
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of creators who trust Grid to build beautiful, 
              high-converting landing pages.
            </p>
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700">
                  Start Building Now - It's Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Grid</span>
            </div>
            <div className="text-gray-400">
              © 2024 Grid. Built with ❤️ for creators.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
