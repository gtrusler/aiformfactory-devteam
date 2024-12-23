"use client";

import { useState, useEffect } from "react";
import { useChatHistory, useSendMessage } from "@/hooks/use-chat";
import MessageThread from "@/components/chat/message-thread";
import MessageInput from "@/components/chat/message-input";
import FileUpload from "@/components/chat/file-upload";
import { AgentList } from "@/components/chat/agent-list";
import { StatusIndicator } from "@/components/chat/status-indicator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { ChatHistory, Json } from "@/lib/supabase/client";

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
}

function getAvatarFromMetadata(metadata: Json): string | undefined {
  if (
    typeof metadata === "object" &&
    metadata !== null &&
    "avatar" in metadata
  ) {
    return metadata.avatar as string;
  }
  return undefined;
}

function mapChatHistoryToMessages(history: ChatHistory[]): Message[] {
  try {
    return history.map((msg) => ({
      id: msg.id,
      content: msg.message,
      sender: {
        id: msg.speaker_id,
        name: msg.speaker?.name || msg.speaker_id,
        avatar: msg.speaker?.metadata
          ? getAvatarFromMetadata(msg.speaker.metadata)
          : undefined,
      },
      timestamp: msg.created_at,
    }));
  } catch (error) {
    console.error("Error mapping chat history:", error);
    return [];
  }
}

export default function ChatPage() {
  console.log("Rendering ChatPage");
  const [selectedAgentId, setSelectedAgentId] = useState("AI");
  const [error, setError] = useState<Error | null>(null);
  const [localMessages, setLocalMessages] = useState<ChatHistory[]>([]);

  const {
    messages: chatHistory,
    loading: isLoading,
    error: chatError,
    isConnected,
  } = useChatHistory({ threadId: "default" });

  const { sendMessage, sending } = useSendMessage({
    threadId: "default",
    speakerId: "user",
  });

  // Update local messages when chat history changes
  useEffect(() => {
    if (chatHistory) {
      setLocalMessages(chatHistory);
    }
  }, [chatHistory]);

  useEffect(() => {
    console.log("Chat connection status:", {
      isConnected,
      isLoading,
      sending,
      messageCount: chatHistory?.length,
    });
  }, [isConnected, isLoading, sending, chatHistory]);

  const handleUserMessage = async (content: string) => {
    try {
      console.log("Handling user message:", { content, selectedAgentId });
      setError(null);

      // Add user message to local state immediately
      const userMessage: ChatHistory = {
        id: crypto.randomUUID(),
        message: content,
        speaker_id: "user",
        thread_id: "default",
        created_at: new Date().toISOString(),
        metadata: {},
        parent_message_id: null,
        embedding: null,
      };
      setLocalMessages((prev) => [...prev, userMessage]);

      // Save user message
      await sendMessage(content);

      // Get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          agentId: selectedAgentId,
          threadId: "default",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      const data = await response.json();
      console.log("API response:", data);

      // Add AI response to local state immediately
      const aiMessage: ChatHistory = {
        id: crypto.randomUUID(),
        message: data.response,
        speaker_id: selectedAgentId,
        thread_id: "default",
        created_at: new Date().toISOString(),
        metadata: {},
        parent_message_id: null,
        embedding: null,
      };
      setLocalMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error handling message:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to handle message")
      );
    }
  };

  const handleAgentSelect = (agentId: string) => {
    console.log("Selected agent:", agentId);
    setSelectedAgentId(agentId);
  };

  const handleFileSelect = async (file: File) => {
    console.log("File selected:", file);
    // TODO: Implement file upload
  };

  return (
    <div className="flex h-full flex-col space-y-2 p-4">
      <div className="flex items-center justify-between">
        <AgentList
          selectedAgentId={selectedAgentId}
          onAgentSelect={handleAgentSelect}
        />
        <StatusIndicator
          isLoading={isLoading || sending}
          isConnected={isConnected}
        />
      </div>

      {(error || chatError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{(error || chatError)?.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-1 flex-col space-y-4 overflow-hidden rounded-lg border bg-background shadow">
        <MessageThread
          messages={mapChatHistoryToMessages(localMessages)}
          isLoading={isLoading || sending}
        />

        <div className="border-t bg-background p-4">
          <div className="grid gap-4">
            <FileUpload onFileSelect={handleFileSelect} />
            <MessageInput
              onSendMessage={handleUserMessage}
              disabled={!isConnected || sending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
