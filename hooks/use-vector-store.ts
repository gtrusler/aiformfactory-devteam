"use client";

import { useState, useCallback } from "react";
import { VectorStoreService } from "@/lib/services/vector-store";

const vectorStore = new VectorStoreService();

export function useVectorSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (embedding: number[]) => {
    try {
      setLoading(true);
      setError(null);
      const results = await vectorStore.search(embedding);
      return results;
    } catch (err) {
      console.error("Vector search error:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to search vectors")
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    search,
    loading,
    error,
  };
}

export function useDocumentManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addDocument = useCallback(
    async (content: string, metadata?: Record<string, any>) => {
      try {
        setLoading(true);
        setError(null);
        await vectorStore.addDocument(content, metadata);
      } catch (err) {
        console.error("Document management error:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to add document")
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    addDocument,
    loading,
    error,
  };
}
