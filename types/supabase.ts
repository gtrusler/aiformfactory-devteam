export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      n8n_chat_histories: {
        Row: {
          id: string;
          created_at: string;
          message: string;
          speaker_id: string;
          thread_id: string;
          metadata: Json | null;
          parent_message_id: string | null;
          embedding: number[] | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          message: string;
          speaker_id: string;
          thread_id: string;
          metadata?: Json | null;
          parent_message_id?: string | null;
          embedding?: number[] | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          message?: string;
          speaker_id?: string;
          thread_id?: string;
          metadata?: Json | null;
          parent_message_id?: string | null;
          embedding?: number[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "n8n_chat_histories_parent_message_id_fkey";
            columns: ["parent_message_id"];
            referencedRelation: "n8n_chat_histories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "n8n_chat_histories_speaker_id_fkey";
            columns: ["speaker_id"];
            referencedRelation: "chat_speakers";
            referencedColumns: ["id"];
          }
        ];
      };
      chat_speakers: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          role: string;
          metadata: Json | null;
          avatar_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          role: string;
          metadata?: Json | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          role?: string;
          metadata?: Json | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      vector_documents: {
        Row: {
          id: string;
          created_at: string;
          content: string;
          metadata: Json | null;
          embedding: number[] | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          content: string;
          metadata?: Json | null;
          embedding?: number[] | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          content?: string;
          metadata?: Json | null;
          embedding?: number[] | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      extract_speaker_id: {
        Args: { message_text: string };
        Returns: string;
      };
      match_documents: {
        Args: {
          query_embedding: number[];
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          similarity: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
