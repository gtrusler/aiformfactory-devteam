import { type Message } from "@/lib/agents/base/base_agent";

export type ChatMessage = Message & {
  isLoading?: boolean;
  error?: string;
  files?: FileAttachment[];
};

export type FileAttachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  uploadProgress?: number;
  error?: string;
};

export type ChatParticipant = {
  id: string;
  name: string;
  avatar?: string;
  role: "user" | "agent" | "consultant" | "liaison";
  status: "online" | "offline" | "busy";
  isTyping?: boolean;
};

export type ChatState = {
  messages: ChatMessage[];
  participants: ChatParticipant[];
  isConnected: boolean;
  activeUploads: number;
  error?: string;
};

export type ChatAction =
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | {
      type: "UPDATE_MESSAGE";
      payload: { id: string; updates: Partial<ChatMessage> };
    }
  | {
      type: "SET_PARTICIPANT_STATUS";
      payload: { id: string; status: ChatParticipant["status"] };
    }
  | { type: "SET_TYPING"; payload: { id: string; isTyping: boolean } }
  | { type: "SET_CONNECTION_STATUS"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | undefined }
  | { type: "START_UPLOAD"; payload: string }
  | {
      type: "UPDATE_UPLOAD_PROGRESS";
      payload: { id: string; progress: number };
    }
  | { type: "COMPLETE_UPLOAD"; payload: string }
  | { type: "FAIL_UPLOAD"; payload: { id: string; error: string } };
