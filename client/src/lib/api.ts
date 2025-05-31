import { apiRequest } from "./queryClient";
import type { GeneratedImage, Template } from "@shared/schema";

export interface GenerateImageRequest {
  prompt: string;
  style: string;
  imageSize: string;
}

export async function generateImage(data: GenerateImageRequest): Promise<GeneratedImage> {
  const response = await apiRequest("POST", "/api/generate-image", data);
  return response.json();
}

export async function getGeneratedImages(): Promise<GeneratedImage[]> {
  const response = await apiRequest("GET", "/api/generated-images");
  return response.json();
}

export async function getTemplates(): Promise<Template[]> {
  const response = await apiRequest("GET", "/api/templates");
  return response.json();
}

export async function getFeaturedTemplates(): Promise<Template[]> {
  const response = await apiRequest("GET", "/api/templates/featured");
  return response.json();
}

export async function likeTemplate(id: number): Promise<Template> {
  const response = await apiRequest("POST", `/api/templates/${id}/like`);
  return response.json();
}

export async function downloadTemplate(id: number): Promise<Template> {
  const response = await apiRequest("POST", `/api/templates/${id}/download`);
  return response.json();
}
