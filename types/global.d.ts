/// <reference types="react" />

// UI Components
declare module "@/components/ui/*" {
  import type { ComponentType } from "react";
  const Component: ComponentType<any>;
  export default Component;
}

// Error Components
declare module "@/components/error" {
  import type { ComponentType } from "react";
  const ErrorComponent: ComponentType<{
    error: Error;
    reset: () => void;
  }>;
  export default ErrorComponent;
}

// Agent Types
declare module "@/lib/agents/base/base_agent" {
  export interface Message {
    id: string;
    content: string;
    role: string;
    createdAt: Date;
    metadata?: Record<string, any>;
  }

  export interface BaseAgent {
    processMessage(message: Message): Promise<Message>;
    getChatHistory(): Message[];
  }
}

// Style Modules
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

// Asset Modules
declare module "*.svg" {
  import type { FC, SVGProps } from "react";
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}

// Data Modules
declare module "*.json" {
  const content: any;
  export default content;
}

declare module "*.yaml" {
  const content: any;
  export default content;
}

declare module "*.yml" {
  const content: any;
  export default content;
}

// Extend Window Interface
interface Window {
  ENV: {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_WEBSOCKET_URL: string;
  };
}
