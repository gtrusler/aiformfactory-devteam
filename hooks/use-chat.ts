"use client";

import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { ChatHistory } from "@/lib/supabase/client";

interface UseChatHistoryProps {
  threadId: string;
}

export function useChatHistory({ threadId }: UseChatHistoryProps) {
  const [messages, setMessages] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from("chat_histories")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      if (supabaseError) throw supabaseError;
      setMessages(data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch messages")
      );
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    console.log("Setting up chat subscription for thread:", threadId);
    fetchMessages();

    // Subscribe to new messages and updates
    const channel = supabase
      .channel(`chat:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_histories",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          console.log("Chat event received:", payload);

          setMessages((prev) => {
            if (payload.eventType === "INSERT") {
              // Check if message already exists to prevent duplicates
              const exists = prev.some((msg) => msg.id === payload.new.id);
              if (!exists) {
                console.log("Adding new message:", payload.new);
                return [...prev, payload.new as ChatHistory];
              }
            } else if (payload.eventType === "UPDATE") {
              console.log("Updating message:", payload.new);
              return prev.map((msg) =>
                msg.id === payload.new.id ? (payload.new as ChatHistory) : msg
              );
            } else if (payload.eventType === "DELETE") {
              console.log("Deleting message:", payload.old);
              return prev.filter((msg) => msg.id !== payload.old.id);
            }
            return prev;
          });
        }
      )
      .subscribe((status) => {
        console.log("Chat subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("Successfully subscribed to chat updates");
        }
      });

    return () => {
      console.log("Cleaning up chat subscription");
      supabase.removeChannel(channel);
    };
  }, [threadId, fetchMessages]);

  return {
    messages,
    loading,
    error,
    refetch: fetchMessages,
  };
}

interface UseSendMessageProps {
  threadId: string;
  speakerId: string;
}

export function useSendMessage({ threadId, speakerId }: UseSendMessageProps) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(
    async (content: string, metadata?: Record<string, any>) => {
      try {
        setSending(true);
        console.log("Sending message:", { threadId, speakerId, content });

        const { data, error: supabaseError } = await supabase
          .from("chat_histories")
          .insert({
            thread_id: threadId,
            speaker_id: speakerId,
            message: content,
            metadata,
          })
          .select()
          .single();

        if (supabaseError) throw supabaseError;
        console.log("Message sent successfully:", data);
        return data;
      } catch (err) {
        console.error("Failed to send message:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to send message")
        );
        throw err;
      } finally {
        setSending(false);
      }
    },
    [threadId, speakerId]
  );

  return {
    sendMessage,
    sending,
    error,
  };
}
