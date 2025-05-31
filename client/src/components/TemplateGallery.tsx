import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Download, Star, ArrowRight, Loader2 } from "lucide-react";
import { getFeaturedTemplates, likeTemplate, downloadTemplate } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function TemplateGallery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["/api/templates/featured"],
    queryFn: getFeaturedTemplates,
  });

  const likeMutation = useMutation({
    mutationFn: likeTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates/featured"] });
      toast({
        title: "Template Liked!",
        description: "Thank you for your feedback.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to like template.",
        variant: "destructive",
      });
    }
  });

  const downloadMutation = useMutation({
    mutationFn: downloadTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates/featured"] });
      toast({
        title: "Template Used!",
        description: "The prompt has been copied for you to use.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to use template.",
        variant: "destructive",
      });
    }
  });

  const handleUseTemplate = (templateId: number, prompt: string) => {
    // Copy prompt to clipboard or set it in the generation interface
    navigator.clipboard.writeText(prompt).then(() => {
      downloadMutation.mutate(templateId);
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Could not copy prompt to clipboard.",
        variant: "destructive",
      });
    });
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case "anime": return "bg-[#8B5CF6]/20 text-[#8B5CF6]";
      case "realistic": return "bg-[#06B6D4]/20 text-[#06B6D4]";
      case "ghibli": return "bg-green-500/20 text-green-400";
      case "artistic": return "bg-[#EC4899]/20 text-[#EC4899]";
      case "sci-fi": return "bg-[#06B6D4]/20 text-[#06B6D4]";
      case "nature": return "bg-green-500/20 text-green-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const renderStars = (rating: number = 5) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'fill-current' : 'stroke-current fill-transparent'}`} 
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className="px-6 pb-20" id="templates">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gradient mb-4">Popular Templates</h2>
            <p className="text-xl text-gray-300">Get inspired with our curated prompt templates</p>
          </div>
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6] mx-auto mb-4" />
            <p className="text-gray-400">Loading templates...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 pb-20" id="templates">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gradient mb-4">Popular Templates</h2>
          <p className="text-xl text-gray-300">Get inspired with our curated prompt templates</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className="glass-morphism rounded-3xl card-3d cursor-pointer group border-white/20 bg-white/10 hover:bg-white/15 transition-all"
              onClick={() => handleUseTemplate(template.id, template.prompt)}
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <img 
                    src={template.previewImage} 
                    alt={`${template.title} template`} 
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                </div>
                <div className="flex items-center mb-3">
                  <Badge className={`${getStyleColor(template.style)} px-3 py-1 rounded-full text-sm font-medium`}>
                    {template.style.charAt(0).toUpperCase() + template.style.slice(1)}
                  </Badge>
                  <div className="ml-auto">
                    {renderStars(Math.floor(Math.random() * 2) + 4)} {/* 4-5 stars randomly */}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{template.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{template.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      likeMutation.mutate(template.id);
                    }}
                    className="flex items-center hover:text-[#EC4899] transition-colors"
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    <span>{template.likes.toLocaleString()}</span>
                  </button>
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-1" />
                    <span>{template.downloads.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-8 py-4 rounded-xl font-semibold btn-3d hover:opacity-90">
            View All Templates
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
