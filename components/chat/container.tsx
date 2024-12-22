import { useCallback, useEffect, useRef, useState } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useVectorStore } from "@/hooks/use-vector-store";
import {
  type ChatMessage,
  type ChatParticipant,
  type ChatState,
} from "@/types/chat";
import { Message } from "./message";
import { ChatInput } from "./input";
import { ParticipantList } from "./participants";
import { cn } from "@/lib/utils";

interface ChatContainerProps {
  initialMessages?: ChatMessage[];
  initialParticipants?: ChatParticipant[];
  websocketUrl: string;
  className?: string;
}

export function ChatContainer({
  initialMessages = [],
  initialParticipants = [],
  websocketUrl,
  className,
}: ChatContainerProps) {
  const [state, setState] = useState<ChatState>({
    messages: initialMessages,
    participants: initialParticipants,
    isConnected: false,
    activeUploads: 0,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { connect, disconnect, sendMessage } = useWebSocket(websocketUrl);
  const { uploadFile } = useVectorStore();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    connect({
      onConnect: () => setState((s) => ({ ...s, isConnected: true })),
      onDisconnect: () => setState((s) => ({ ...s, isConnected: false })),
      onMessage: (message: ChatMessage) =>
        setState((s) => ({ ...s, messages: [...s.messages, message] })),
      onParticipantUpdate: (participant: ChatParticipant) =>
        setState((s) => ({
          ...s,
          participants: s.participants.map((p) =>
            p.id === participant.id ? participant : p
          ),
        })),
    });

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, scrollToBottom]);

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!state.isConnected) return;

    const message: ChatMessage = {
      content,
      speaker_id: "user",
      timestamp: new Date().toISOString(),
    };

    setState((s) => ({
      ...s,
      messages: [...s.messages, message],
      activeUploads: s.activeUploads + (files?.length || 0),
    }));

    if (files?.length) {
      const uploadPromises = files.map(async (file) => {
        try {
          const attachment = await uploadFile(file, (progress) => {
            // Update upload progress
          });
          return attachment;
        } catch (error) {
          console.error("File upload failed:", error);
          return null;
        }
      });

      const attachments = (await Promise.all(uploadPromises)).filter(Boolean);
      if (attachments.length) {
        message.files = attachments;
      }
    }

    await sendMessage(message);
    setState((s) => ({
      ...s,
      activeUploads: s.activeUploads - (files?.length || 0),
    }));
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="border-b p-4">
        <ParticipantList participants={state.participants} />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-2">
          {state.messages.map((message, index) => {
            const participant = state.participants.find(
              (p) => p.id === message.speaker_id
            );
            if (!participant) return null;

            return (
              <Message
                key={index}
                message={message}
                participant={participant}
                isLastMessage={index === state.messages.length - 1}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t p-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          onFileUpload={uploadFile}
          isLoading={!state.isConnected || state.activeUploads > 0}
        />
      </div>
    </div>
  );
}
