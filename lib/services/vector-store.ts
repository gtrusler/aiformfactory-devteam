import { supabase } from "@/lib/supabase/client";
import type { Document } from "@/lib/supabase/client";

export class VectorStoreService {
  async search(embedding: number[], threshold = 0.8, limit = 5) {
    try {
      const { data, error } = await supabase.rpc("match_documents", {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit,
      });

      if (error) {
        console.error("Vector search error:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Vector search failed:", error);
      throw error;
    }
  }

  async addDocument(content: string, metadata?: Record<string, any>) {
    try {
      const { data, error } = await supabase
        .from("documents")
        .insert([
          {
            content,
            metadata,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Document insertion error:", error);
        throw error;
      }

      return data as Document;
    } catch (error) {
      console.error("Document insertion failed:", error);
      throw error;
    }
  }
}
