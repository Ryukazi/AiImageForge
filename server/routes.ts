import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGeneratedImageSchema } from "@shared/schema";
import { generateImage } from "./openai";
import { z } from "zod";

const generateImageRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  style: z.string().min(1, "Style is required"),
  imageSize: z.string().default("1024x1024"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate a new image
  app.post("/api/generate-image", async (req, res) => {
    try {
      const validatedData = generateImageRequestSchema.parse(req.body);
      
      // Generate image using OpenAI
      const result = await generateImage({
        prompt: validatedData.prompt,
        style: validatedData.style,
        size: validatedData.imageSize as "512x512" | "768x512" | "512x768" | "1024x1024",
      });

      // Save to storage
      const savedImage = await storage.createGeneratedImage({
        prompt: validatedData.prompt,
        style: validatedData.style,
        imageUrl: result.url,
        imageSize: validatedData.imageSize,
      });

      res.json(savedImage);
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate image" 
      });
    }
  });

  // Get all generated images
  app.get("/api/generated-images", async (req, res) => {
    try {
      const images = await storage.getGeneratedImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching generated images:", error);
      res.status(500).json({ message: "Failed to fetch generated images" });
    }
  });

  // Get a specific generated image
  app.get("/api/generated-images/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid image ID" });
      }

      const image = await storage.getGeneratedImage(id);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      res.json(image);
    } catch (error) {
      console.error("Error fetching generated image:", error);
      res.status(500).json({ message: "Failed to fetch generated image" });
    }
  });

  // Get all templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Get featured templates
  app.get("/api/templates/featured", async (req, res) => {
    try {
      const templates = await storage.getFeaturedTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching featured templates:", error);
      res.status(500).json({ message: "Failed to fetch featured templates" });
    }
  });

  // Get a specific template
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }

      const template = await storage.getTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Like a template
  app.post("/api/templates/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }

      await storage.incrementTemplateLikes(id);
      const template = await storage.getTemplate(id);
      
      res.json(template);
    } catch (error) {
      console.error("Error liking template:", error);
      res.status(500).json({ message: "Failed to like template" });
    }
  });

  // Download a template (increment download count)
  app.post("/api/templates/:id/download", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }

      await storage.incrementTemplateDownloads(id);
      const template = await storage.getTemplate(id);
      
      res.json(template);
    } catch (error) {
      console.error("Error downloading template:", error);
      res.status(500).json({ message: "Failed to download template" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
