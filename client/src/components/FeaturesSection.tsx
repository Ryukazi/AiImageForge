import { Card, CardContent } from "@/components/ui/card";
import { Wand2, Zap, Palette, Download } from "lucide-react";

const features = [
  {
    icon: Wand2,
    title: "Multiple Styles",
    description: "Generate images in anime, realistic, Ghibli, and artistic styles with our advanced AI models",
    gradient: "from-[#8B5CF6] to-[#EC4899]"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate high-quality images in just 10-30 seconds with our optimized AI infrastructure",
    gradient: "from-[#06B6D4] to-[#8B5CF6]"
  },
  {
    icon: Palette,
    title: "High Resolution",
    description: "Create images up to 1024x1024 resolution perfect for print and professional use",
    gradient: "from-[#EC4899] to-[#06B6D4]"
  },
  {
    icon: Download,
    title: "Easy Download",
    description: "Download your creations instantly in high quality with full commercial usage rights",
    gradient: "from-[#8B5CF6] to-[#EC4899]"
  }
];

export default function FeaturesSection() {
  return (
    <section className="px-6 pb-20" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gradient mb-4">Powerful AI Features</h2>
          <p className="text-xl text-gray-300">Everything you need to create stunning images</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="glass-morphism rounded-3xl text-center card-3d border-white/20 bg-white/10">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="text-white h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
