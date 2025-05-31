import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import GenerationInterface from "@/components/GenerationInterface";
import TemplateGallery from "@/components/TemplateGallery";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

export default function ImageGenerator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#374151] text-white overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <GenerationInterface />
      <TemplateGallery />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
