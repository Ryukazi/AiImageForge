import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-morphism rounded-2xl px-6 py-4 animate-float">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-xl flex items-center justify-center">
                <i className="fas fa-magic text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">AI Studio</h1>
                <p className="text-xs text-gray-400">by Denish Tharu</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</a>
              <a href="#templates" className="text-gray-300 hover:text-white transition-colors">Templates</a>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2 rounded-xl font-medium btn-3d hover:opacity-90">
                Sign In
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
