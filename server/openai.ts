import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ImageGenerationOptions {
  prompt: string;
  style: string;
  size?: "512x512" | "768x512" | "512x768" | "1024x1024";
}

export async function generateImage(options: ImageGenerationOptions): Promise<{ url: string }> {
  try {
    // Enhance prompt based on style
    let enhancedPrompt = options.prompt;
    
    switch (options.style) {
      case "anime":
        enhancedPrompt = `Anime style artwork: ${options.prompt}, vibrant colors, detailed digital art, Japanese animation style`;
        break;
      case "realistic":
        enhancedPrompt = `Photorealistic: ${options.prompt}, high quality, professional photography, detailed, sharp focus`;
        break;
      case "ghibli":
        enhancedPrompt = `Studio Ghibli style: ${options.prompt}, soft colors, dreamy atmosphere, hand-drawn animation style, magical realism`;
        break;
      case "artistic":
        enhancedPrompt = `Abstract artistic style: ${options.prompt}, creative composition, modern art, vibrant colors, artistic interpretation`;
        break;
      case "sci-fi":
        enhancedPrompt = `Science fiction style: ${options.prompt}, futuristic, technological, atmospheric, cyberpunk aesthetic`;
        break;
      case "nature":
        enhancedPrompt = `Natural landscape: ${options.prompt}, pristine nature, beautiful scenery, environmental photography`;
        break;
      default:
        enhancedPrompt = options.prompt;
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: options.size || "1024x1024",
      quality: "standard",
    });

    if (!response.data[0]?.url) {
      throw new Error("No image URL returned from OpenAI");
    }

    return { url: response.data[0].url };
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
