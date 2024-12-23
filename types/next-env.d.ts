/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference types="next/navigation" />

// Extend the Window interface for Next.js
declare global {
  interface Window {
    ENV: {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      NEXT_PUBLIC_WEBSOCKET_URL: string;
    };
  }
}

// Extend NodeJS ProcessEnv
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly NEXT_PUBLIC_SUPABASE_URL: string;
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    readonly NEXT_PUBLIC_WEBSOCKET_URL: string;
    readonly OPENAI_API_KEY: string;
    readonly ANTHROPIC_API_KEY: string;
    readonly GOOGLE_API_KEY: string;
  }
}

export {};
