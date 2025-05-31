import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, Share2, RefreshCw, Trash2, Wand2, Loader2 } from "lucide-react";
import { generateImage, getGeneratedImages } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedImage } from "@shared/schema";

const styles = [
  { id: "anime", name: "Anime", icon: "🎨" },
  { id: "realistic", name: "Realistic", icon: "👤" },
  { id: "ghibli", name: "Ghibli", icon: "☁️" },
  { id: "artistic", name: "Artistic", icon: "🖌️" },
  { id: "sci-fi", name: "Sci-Fi", icon: "🚀" },
  { id: "nature", name: "Nature", icon: "🌿" }
];

const imageSizes = [
  { value: "512x512", label: "512 x 512 (Square)" },
  { value: "768x512", label: "768 x 512 (Landscape)" },
  { value: "512x768", label: "512 x 768 (Portrait)" },
  { value: "1024x1024", label: "1024 x 1024 (HD Square)" }
];

export default function GenerationInterface() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("anime");
  const [imageSize, setImageSize] = useState("1024x1024");
  const [progress, setProgress] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: generatedImages = [], isLoading: imagesLoading } = useQuery({
    queryKey: ["/api/generated-images"],
    queryFn: getGeneratedImages,
  });

  const generateMutation = useMutation({
    mutationFn: generateImage,
    onMutate: () => {
      setProgress(0);
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          if (newProgress >= 95) {
            clearInterval(interval);
            return 95;
          }
          return newProgress;
        });
      }, 200);
      
      return { interval };
    },
    onSuccess: (data) => {
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
      queryClient.invalidateQueries({ queryKey: ["/api/generated-images"] });
      toast({
        title: "Image Generated Successfully!",
        description: "Your AI masterpiece is ready.",
      });
    },
    onError: (error) => {
      setProgress(0);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: (data, error, variables, context) => {
      if (context?.interval) {
        clearInterval(context.interval);
      }
    }
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please describe the image you want to create.",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      prompt: prompt.trim(),
      style: selectedStyle,
      imageSize,
    });
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your image is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (imageUrl: string, prompt: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Image',
          text: prompt,
          url: imageUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(imageUrl);
        toast({
          title: "Link Copied",
          description: "Image link copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Share Failed",
          description: "Unable to share the image.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <section className="px-6 pb-20" id="gallery">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <Card className="glass-morphism rounded-3xl card-3d border-white/20 bg-white/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-gradient">Create Your Image</h2>
                
                {/* Prompt Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Describe Your Image</label>
                  <Textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-[#1E293B]/50 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all resize-none" 
                    rows={4}
                    placeholder="A beautiful anime girl with long blue hair standing in a magical forest..."
                  />
                </div>

                {/* Style Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Art Style</label>
                  <div className="grid grid-cols-2 gap-3">
                    {styles.map((style) => (
                      <Button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        variant={selectedStyle === style.id ? "default" : "outline"}
                        className={`p-3 rounded-xl text-sm font-medium transition-all btn-3d ${
                          selectedStyle === style.id
                            ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#8B5CF6]'
                            : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                        }`}
                      >
                        <span className="mr-2">{style.icon}</span>
                        {style.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Generation Settings */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Image Size</label>
                  <Select value={imageSize} onValueChange={setImageSize}>
                    <SelectTrigger className="w-full bg-[#1E293B]/50 border-gray-600 rounded-xl text-white focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E293B] border-gray-600">
                      {imageSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value} className="text-white focus:bg-[#8B5CF6]/20">
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] py-4 rounded-xl font-semibold text-lg btn-3d animate-glow hover:opacity-90"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" />
                      Generate Image
                    </>
                  )}
                </Button>

                {/* Loading State */}
                {generateMutation.isPending && (
                  <div className="mt-4">
                    <Card className="glass-morphism rounded-xl border-white/20 bg-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <Loader2 className="h-4 w-4 animate-spin text-[#8B5CF6] mr-2" />
                          <span className="text-sm">Generating your masterpiece...</span>
                        </div>
                        <Progress value={progress} className="w-full h-2 bg-gray-700" />
                        <p className="text-xs text-gray-400 mt-2">This may take 10-30 seconds</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Generated Images */}
          <div className="lg:col-span-2">
            <Card className="glass-morphism rounded-3xl card-3d border-white/20 bg-white/10">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gradient">Generated Images</h2>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      size="icon"
                      onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/generated-images"] })}
                      className="bg-[#1E293B]/50 border-gray-600 hover:bg-[#1E293B] text-[#06B6D4]"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline"
                      size="icon"
                      className="bg-[#1E293B]/50 border-gray-600 hover:bg-[#1E293B] text-gray-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {imagesLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6] mx-auto mb-4" />
                    <p className="text-gray-400">Loading your creations...</p>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedImages.map((image) => (
                      <div key={image.id} className="group relative card-3d">
                        <Card className="glass-morphism rounded-2xl border-white/20 bg-white/10">
                          <CardContent className="p-4">
                            <img 
                              src={image.imageUrl} 
                              alt={`Generated ${image.style} image`} 
                              className="w-full h-64 object-cover rounded-xl mb-4"
                            />
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-400 capitalize">{image.style} Style</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(image.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDownload(image.imageUrl, image.prompt)}
                                  className="bg-[#8B5CF6]/20 border-[#8B5CF6] hover:bg-[#8B5CF6]/30 text-[#8B5CF6]"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleShare(image.imageUrl, image.prompt)}
                                  className="bg-[#06B6D4]/20 border-[#06B6D4] hover:bg-[#06B6D4]/30 text-[#06B6D4]"
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wand2 className="h-12 w-12 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Images Generated Yet</h3>
                    <p className="text-gray-500">Create your first AI masterpiece using the controls on the left</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
