
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Grid3X3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedHeader from "@/components/AnimatedHeader";
import AnimatedFeatures from "@/components/AnimatedFeatures";
import HeroScene from "@/components/3D/HeroScene";

const Index = () => {
  const { user } = useAuth();

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AnimatedHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="inline-flex items-center space-x-2 bg-purple-600/10 border border-purple-600/20 rounded-full px-4 py-2 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Powered by modern web technology</span>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            Just publish it
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              with Grid
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Design, build, and publish stunning landing pages in minutes. 
            No code required, just pure creativity.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {user ? (
              <Link to="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button size="lg" className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
            ) : (
              <Link to="/auth">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button size="lg" className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700">
                    Start Building Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
            )}
            <Link to="/templates">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                  Browse Templates
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* 3D Hero Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
              <HeroScene />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Not everything powerful
            <br />
            <span className="text-gray-400">has to look complicated</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Grid combines the power of professional design tools with the simplicity your team needs.
          </p>
        </motion.div>

        <AnimatedFeatures />
      </section>

      {/* Simple to Learn Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple to learn,
              <br />
              <span className="text-gray-400">easy to master</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Grid's intuitive interface means you can start creating professional landing pages 
              from day one. No steep learning curve, just results.
            </p>
            <motion.div 
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                "Start with professional templates",
                "Customize with visual controls",
                "Publish with one click"
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-3"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-300">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-2xl"></div>
            <motion.div 
              className="relative bg-gray-900 border border-gray-800 rounded-xl p-6 backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { from: "purple-600/40", to: "pink-600/40" },
                  { from: "blue-600/40", to: "purple-600/40" },
                  { from: "green-600/40", to: "blue-600/40" },
                  { from: "orange-600/40", to: "red-600/40" }
                ].map((gradient, index) => (
                  <motion.div 
                    key={index}
                    className="bg-gray-800 rounded-lg p-3 border border-gray-700"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className={`w-full h-16 bg-gradient-to-r from-${gradient.from} to-${gradient.to} rounded mb-2`}></div>
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-gray-700 rounded"></div>
                      <div className="w-3/4 h-2 bg-gray-700 rounded"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
            ) : (
              <Link to="/auth">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700">
                    Start Building Now - It's Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              className="flex items-center space-x-2 mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Grid</span>
            </motion.div>
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
