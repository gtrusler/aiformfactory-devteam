import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
    heartbeat: {
      interval: 5000,
      timeout: 7000,
    },
    presence: {
      key: "online_at",
    },
  },
  db: {
    schema: "public",
  },
});

// Debug real-time connection
const channel = supabase.channel("system");
channel
  .on("presence", { event: "sync" }, () => {
    console.log("System presence sync");
  })
  .on("presence", { event: "join" }, () => {
    console.log("System presence join");
  })
  .on("presence", { event: "leave" }, () => {
    console.log("System presence leave");
  })
  .subscribe((status) => {
    console.log("System channel status:", status);
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
  speaker?: ChatSpeaker;
}

export interface ChatSpeaker {
  id: string;
  created_at: string;
  name: string;
  type: string;
  metadata: Json;
}

export interface Document {
  id: string;
  created_at: string;
  content: string;
  metadata: Json;
  embedding: number[] | null;
}
