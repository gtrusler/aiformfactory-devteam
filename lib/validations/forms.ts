import * as z from "zod";

export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  speakerId: z.string(),
  attachments: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        size: z.number(),
        url: z.string().optional(),
      })
    )
    .optional(),
});

export const settingsSchema = z.object({
  openaiApiKey: z.string().min(1, "API key is required"),
  geminiApiKey: z.string().min(1, "API key is required"),
  defaultModel: z.enum(["gpt-4", "gemini-pro"]),
  enableAutoSave: z.boolean(),
  maxTokens: z.number().min(100).max(4000),
});

export const fileSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  size: z.number(),
  uploadedAt: z.date(),
});

export type Message = z.infer<typeof messageSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type File = z.infer<typeof fileSchema>;
