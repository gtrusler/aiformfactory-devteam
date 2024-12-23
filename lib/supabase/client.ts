import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  db: {
    schema: "public",
  },
});

// Debug real-time connection
const channel = supabase.channel("system");
channel
  .on("system", { event: "*" }, (payload) => {
    console.log("System event:", payload);
  })
  .subscribe((status) => {
    if (status === "SUBSCRIBED") {
      console.log("Connected to Supabase realtime");
    }
  });

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface ChatHistory {
  id: string;
  created_at: string;
  message: string;
  speaker_id: string;
  thread_id: string;
  metadata: Json;
  parent_message_id: string | null;
  embedding: number[] | null;
}

export interface ChatSpeaker {
  id: string;
  created_at: string;
  name: string;
  role: string;
  metadata: Json;
}

export interface Document {
  id: string;
  created_at: string;
  content: string;
  metadata: Json;
  embedding: number[] | null;
}
