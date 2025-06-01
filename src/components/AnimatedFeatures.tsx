
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mouse, Palette, Smartphone, Code, Globe, Layers } from "lucide-react";

const features = [
  {
    icon: Mouse,
    title: "Drag & Drop Builder",
    description: "Intuitive visual editor with pre-built blocks. Simply drag, drop, and customize to create your perfect page."
  },
  {
    icon: Palette,
    title: "Custom Styling",
    description: "Full control over colors, fonts, spacing, and layout. Make every element match your brand perfectly."
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Your pages automatically adapt to any screen size. Perfect on desktop, tablet, and mobile devices."
  },
  {
    icon: Code,
    title: "Clean Code Export",
    description: "Export your designs as clean HTML/CSS code or publish directly to a custom URL."
  },
  {
    icon: Globe,
    title: "Instant Publishing",
    description: "Publish your pages instantly with a custom URL. Share your creations with the world in seconds."
  },
  {
    icon: Layers,
    title: "Project Management",
    description: "Manage multiple projects, save templates, and organize all your landing pages in one place."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function AnimatedFeatures() {
  return (
    <motion.div 
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {features.map((feature, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card className="bg-gray-900 border-gray-800 hover:border-purple-600/50 transition-all duration-300 h-full">
            <CardHeader>
              <motion.div 
                className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <feature.icon className="w-6 h-6 text-purple-400" />
              </motion.div>
              <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">{feature.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
