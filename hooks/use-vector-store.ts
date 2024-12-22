import { useCallback } from "react";
import { type FileAttachment } from "@/types/chat";
import { SupabaseStore } from "@/lib/vectorstore/supabase_store";

const vectorStore = new SupabaseStore(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useVectorStore() {
  const uploadFile = useCallback(
    async (
      file: File,
      onProgress?: (progress: number) => void
    ): Promise<FileAttachment> => {
      const attachment: FileAttachment = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
      };

      try {
        // Create a blob URL for immediate preview
        attachment.url = URL.createObjectURL(file);

        // Simulate upload progress (replace with actual upload logic)
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          onProgress?.(progress);
          if (progress >= 100) clearInterval(interval);
        }, 100);

        // Convert file to text if it's a supported type
        if (file.type.startsWith("text/") || file.type === "application/json") {
          const text = await file.text();
          await vectorStore.add_documents([
            {
              pageContent: text,
              metadata: {
                filename: file.name,
                filetype: file.type,
                filesize: file.size,
                attachment_id: attachment.id,
              },
            },
          ]);
        }

        return attachment;
      } catch (error) {
        console.error("Failed to upload file:", error);
        attachment.error = "Failed to upload file";
        throw error;
      }
    },
    []
  );

  return {
    uploadFile,
  };
}
