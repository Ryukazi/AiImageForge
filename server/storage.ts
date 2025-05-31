import { 
  users, 
  generatedImages, 
  templates,
  type User, 
  type InsertUser,
  type GeneratedImage,
  type InsertGeneratedImage,
  type Template,
  type InsertTemplate
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createGeneratedImage(image: InsertGeneratedImage): Promise<GeneratedImage>;
  getGeneratedImages(): Promise<GeneratedImage[]>;
  getGeneratedImage(id: number): Promise<GeneratedImage | undefined>;
  
  getTemplates(): Promise<Template[]>;
  getFeaturedTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  incrementTemplateLikes(id: number): Promise<void>;
  incrementTemplateDownloads(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private generatedImages: Map<number, GeneratedImage>;
  private templates: Map<number, Template>;
  private currentUserId: number;
  private currentImageId: number;
  private currentTemplateId: number;

  constructor() {
    this.users = new Map();
    this.generatedImages = new Map();
    this.templates = new Map();
    this.currentUserId = 1;
    this.currentImageId = 1;
    this.currentTemplateId = 1;
    
    // Initialize with some featured templates
    this.initializeTemplates();
  }

  private initializeTemplates() {
    const defaultTemplates: Omit<Template, 'id'>[] = [
      {
        title: "Fantasy Anime World",
        description: "Beautiful anime character in a magical fantasy world with floating islands and mystical creatures",
        prompt: "A beautiful anime girl with long blue hair standing in a magical forest with floating lights and mystical creatures, detailed digital art, vibrant colors",
        style: "anime",
        previewImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        likes: 1200,
        downloads: 856,
        featured: true,
      },
      {
        title: "Professional Portrait",
        description: "High-quality professional headshot with perfect lighting and composition for business use",
        prompt: "Professional business portrait, confident person, studio lighting, high quality, sharp focus, corporate headshot",
        style: "realistic",
        previewImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        likes: 892,
        downloads: 634,
        featured: true,
      },
      {
        title: "Dreamy Landscape",
        description: "Peaceful Studio Ghibli inspired landscape with rolling hills and magical atmosphere",
        prompt: "Studio Ghibli style landscape, rolling green hills, peaceful countryside, soft lighting, dreamy atmosphere, magical realism",
        style: "ghibli",
        previewImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        likes: 2100,
        downloads: 1500,
        featured: true,
      },
      {
        title: "Abstract Flow",
        description: "Dynamic abstract composition with flowing colors and energetic movement patterns",
        prompt: "Abstract digital art, flowing colors, dynamic composition, vibrant gradients, energy patterns, modern art style",
        style: "artistic",
        previewImage: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        likes: 743,
        downloads: 521,
        featured: true,
      },
      {
        title: "Cyberpunk City",
        description: "Futuristic cyberpunk cityscape with neon lights and advanced technology elements",
        prompt: "Cyberpunk cityscape, neon lights, futuristic architecture, night scene, atmospheric fog, sci-fi aesthetic",
        style: "sci-fi",
        previewImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        likes: 1800,
        downloads: 1200,
        featured: true,
      },
      {
        title: "Mountain Serenity",
        description: "Peaceful mountain landscape with pristine nature and calming atmosphere",
        prompt: "Serene mountain landscape, pristine nature, crystal clear lake, peaceful atmosphere, natural beauty, photorealistic",
        style: "nature",
        previewImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        likes: 956,
        downloads: 701,
        featured: true,
      }
    ];

    defaultTemplates.forEach(template => {
      const id = this.currentTemplateId++;
      this.templates.set(id, { ...template, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createGeneratedImage(insertImage: InsertGeneratedImage): Promise<GeneratedImage> {
    const id = this.currentImageId++;
    const image: GeneratedImage = { 
      ...insertImage, 
      id, 
      createdAt: new Date() 
    };
    this.generatedImages.set(id, image);
    return image;
  }

  async getGeneratedImages(): Promise<GeneratedImage[]> {
    return Array.from(this.generatedImages.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getGeneratedImage(id: number): Promise<GeneratedImage | undefined> {
    return this.generatedImages.get(id);
  }

  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getFeaturedTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(template => template.featured);
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async incrementTemplateLikes(id: number): Promise<void> {
    const template = this.templates.get(id);
    if (template) {
      template.likes++;
      this.templates.set(id, template);
    }
  }

  async incrementTemplateDownloads(id: number): Promise<void> {
    const template = this.templates.get(id);
    if (template) {
      template.downloads++;
      this.templates.set(id, template);
    }
  }
}

export const storage = new MemStorage();
