"use client";

import { useState, useEffect } from "react";
import { useAgent } from "@/hooks/use-agent";
import MessageThread from "@/components/chat/message-thread";
import MessageInput from "@/components/chat/message-input";
import FileUpload from "@/components/chat/file-upload";
import { AgentList } from "@/components/chat/agent-list";
import { StatusIndicator } from "@/components/chat/status-indicator";
import { Alert } from "@/components/ui/alert";
import type { ChatHistory } from "@/lib/supabase/client";

function mapChatHistoryToMessages(history: ChatHistory[] = []) {
  try {
    return history.map((msg) => ({
      id: msg.id,
      content: msg.message,
      sender: {
        id: msg.speaker_id,
        name: msg.speaker_id,
        avatar:
          typeof msg.metadata === "object" && msg.metadata !== null
            ? ((msg.metadata as Record<string, unknown>).avatar as
                | string
                | undefined)
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

  const {
    messages: chatHistory,
    isLoading,
    handleMessage,
    handleFileUpload,
  } = useAgent({
    threadId: "default",
    agentId: selectedAgentId,
  });

  const handleUserMessage = async (content: string) => {
    try {
      setError(null);

      // First send the user's message
      await handleMessage(content, "user");

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

      // Send the AI's response
      await handleMessage(data.response, selectedAgentId);
    } catch (err) {
      console.error("Error handling message:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to handle message")
      );
    }
  };

  useEffect(() => {
    console.log("Agent state updated:", {
      selectedAgentId,
      isLoading,
      messageCount: chatHistory?.length,
    });
  }, [selectedAgentId, isLoading, chatHistory]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <p>Something went wrong: {error.message}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 rounded bg-destructive-foreground px-4 py-2 text-sm text-destructive hover:bg-destructive-foreground/90"
          >
            Try again
          </button>
        </Alert>
      </div>
    );
  }

  const messages = mapChatHistoryToMessages(chatHistory);

  return (
    <div className="flex h-full">
      <div className="w-[300px] border-r">
        <AgentList
          selectedAgentId={selectedAgentId}
          onAgentSelect={setSelectedAgentId}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex-1">
          <MessageThread messages={messages} isLoading={isLoading} />
        </div>
        <div className="p-4 space-y-4">
          <MessageInput
            onSendMessage={handleUserMessage}
            disabled={isLoading}
          />
          <FileUpload onFileSelect={handleFileUpload} />
        </div>
        <StatusIndicator connected={true} processing={isLoading} error={null} />
      </div>
    </div>
  );
}
