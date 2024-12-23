"use client";

import { useState, useCallback, useEffect } from "react";
import { useChatHistory, useSendMessage } from "./use-chat";

interface UseAgentProps {
  agentId: string;
  threadId: string;
}

export function useAgent({ agentId, threadId }: UseAgentProps) {
  console.log("useAgent hook called with:", { agentId, threadId });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    messages,
    loading: isLoadingHistory,
    error: historyError,
  } = useChatHistory({ threadId });

  const {
    sendMessage: sendUserMessage,
    sending: isUserSending,
    error: userSendError,
  } = useSendMessage({
    threadId,
    speakerId: "user",
  });

  const {
    sendMessage: sendAgentMessage,
    sending: isAgentSending,
    error: agentSendError,
  } = useSendMessage({
    threadId,
    speakerId: agentId,
  });

  useEffect(() => {
    if (historyError) {
      console.error("Chat history error:", historyError);
      setError(historyError);
    } else if (userSendError) {
      console.error("User message sending error:", userSendError);
      setError(userSendError);
    } else if (agentSendError) {
      console.error("Agent message sending error:", agentSendError);
      setError(agentSendError);
    }
  }, [historyError, userSendError, agentSendError]);

  const handleMessage = useCallback(
    async (content: string, speakerId: string = "user") => {
      console.log("Handling message:", { content, speakerId });
      try {
        setIsProcessing(true);
        setError(null);

        if (speakerId === "user") {
          await sendUserMessage(content);
        } else {
          await sendAgentMessage(content);
        }

        console.log("Message sent successfully");
      } catch (error) {
        console.error("Error processing message:", error);
        setError(
          error instanceof Error
            ? error
            : new Error("Failed to process message")
        );
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [sendUserMessage, sendAgentMessage]
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      console.log("Handling file upload:", {
        name: file.name,
        size: file.size,
      });
      try {
        setIsProcessing(true);
        setError(null);
        await sendUserMessage(`Uploaded file: ${file.name}`, {
          type: "file_upload",
          file: {
            name: file.name,
            type: file.type,
            size: file.size,
          },
        });
        console.log("File upload message sent");
      } catch (error) {
        console.error("Error processing file:", error);
        setError(
          error instanceof Error ? error : new Error("Failed to process file")
        );
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [sendUserMessage]
  );

  return {
    messages,
    isLoading:
      isLoadingHistory || isUserSending || isAgentSending || isProcessing,
    error,
    handleMessage,
    handleFileUpload,
  };
}
