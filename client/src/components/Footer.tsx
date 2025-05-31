import { Button } from "@/components/ui/button";
import { Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-6 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-xl flex items-center justify-center">
                <i className="fas fa-magic text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gradient">AI Studio</h3>
                <p className="text-sm text-gray-400">by Denish Tharu</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Create stunning AI-generated images with our professional-grade tools. From anime to realistic portraits, bring your imagination to life.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="bg-[#1E293B] border-gray-600 hover:bg-[#8B5CF6] transition-colors">
                <Twitter className="h-4 w-4 text-white" />
              </Button>
              <Button variant="outline" size="icon" className="bg-[#1E293B] border-gray-600 hover:bg-[#8B5CF6] transition-colors">
                <Instagram className="h-4 w-4 text-white" />
              </Button>
              <Button variant="outline" size="icon" className="bg-[#1E293B] border-gray-600 hover:bg-[#8B5CF6] transition-colors">
                <Github className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#templates" className="hover:text-white transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">© {currentYear} AI Studio by Denish Tharu. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-sm text-gray-400">Powered by advanced AI technology</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
