"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useChatHistory, useSendMessage } from "@/hooks/use-chat";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import MessageInput from "./message-input";
import { Message } from "./message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ChatContainerProps {
  threadId: string;
  className?: string;
}

const AGENTS = {
  AI: {
    id: "AI",
    name: "AI Assistant",
    description: "General Assistant",
  },
  PM: {
    id: "PM",
    name: "Project Manager",
    description: "Project Management",
  },
  DEV: {
    id: "DEV",
    name: "Developer",
    description: "Technical Support",
  },
};

export function ChatContainer({ threadId, className }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedAgent, setSelectedAgent] = useState("AI");
  const { messages, loading, error, isConnected } = useChatHistory({ threadId });
  const { sendMessage, sending } = useSendMessage({
    threadId,
    speakerId: "user",
  });

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      // Save user message first
      await sendMessage(content);

      // Get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          threadId,
          agentId: selectedAgent,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to get AI response");
      }
    } catch (error) {
      console.error("Error in chat flow:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process message");
    }
  };

  return (
    <div className={cn("flex h-full flex-col space-y-4", className)}>
      {/* Agent Selection */}
      <div className="border-b p-4">
        <RadioGroup
          defaultValue="AI"
          value={selectedAgent}
          onValueChange={setSelectedAgent}
          className="flex flex-wrap gap-4"
        >
          {Object.values(AGENTS).map((agent) => (
            <div key={agent.id} className="flex items-center space-x-2">
              <RadioGroupItem value={agent.id} id={agent.id} />
              <Label htmlFor={agent.id} className="cursor-pointer">
                {agent.name}
                <span className="ml-2 text-xs text-muted-foreground">
                  {agent.description}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Connection Status */}
      <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className={cn(
            "h-2 w-2 rounded-full",
            isConnected ? "bg-green-500" : "bg-red-500"
          )} />
          <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
        {(loading || sending) && (
          <div className="flex items-center gap-2">
            <span>Processing...</span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mx-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={{
                content: message.message,
                timestamp: message.created_at,
                isLoading: false,
              }}
              participant={message.speaker || {
                id: message.speaker_id,
                name: message.speaker_id === "user" ? "You" : AGENTS[message.speaker_id as keyof typeof AGENTS]?.name || "AI Assistant",
                type: message.speaker_id === "user" ? "human" : "assistant",
                metadata: {
                  role: message.speaker_id === "user" ? "user" : "assistant",
                },
              }}
              isLastMessage={message.id === messages[messages.length - 1]?.id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={!isConnected || sending}
          placeholder={isConnected ? "Type a message..." : "Connecting to chat server..."}
        />
      </div>
    </div>
  );
}
