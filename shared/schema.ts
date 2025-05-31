import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const generatedImages = pgTable("generated_images", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  style: text("style").notNull(),
  imageUrl: text("image_url").notNull(),
  imageSize: text("image_size").notNull().default("1024x1024"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  prompt: text("prompt").notNull(),
  style: text("style").notNull(),
  previewImage: text("preview_image").notNull(),
  likes: integer("likes").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGeneratedImageSchema = createInsertSchema(generatedImages).pick({
  prompt: true,
  style: true,
  imageUrl: true,
  imageSize: true,
}).extend({
  imageSize: z.string().default("1024x1024"),
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  title: true,
  description: true,
  prompt: true,
  style: true,
  previewImage: true,
  featured: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGeneratedImage = z.infer<typeof insertGeneratedImageSchema>;
export type GeneratedImage = typeof generatedImages.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;
