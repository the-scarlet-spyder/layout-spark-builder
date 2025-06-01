
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Grid3X3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AnimatedHeader() {
  const { user } = useAuth();

  return (
    <motion.header 
      className="container mx-auto px-6 py-4 border-b border-gray-800"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg flex items-center justify-center">
            <Grid3X3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Grid</span>
        </motion.div>
        <div className="flex items-center space-x-4">
          <Link to="/templates">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                Templates
              </Button>
            </motion.div>
          </Link>
          {user ? (
            <Link to="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-purple-600 hover:bg-purple-700">Dashboard</Button>
              </motion.div>
            </Link>
          ) : (
            <Link to="/auth">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-purple-600 hover:bg-purple-700">Sign In</Button>
              </motion.div>
            </Link>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
