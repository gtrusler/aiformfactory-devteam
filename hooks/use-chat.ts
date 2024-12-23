import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface Message {
  id: string;
  message: string;
  speaker_id: string;
  thread_id: string;
  created_at: string;
  speaker?: {
    id: string;
    name: string;
    type: string;
    metadata: Record<string, any>;
  } | null;
  metadata?: Record<string, any>;
}

interface UseChatHistoryProps {
  threadId: string;
}

interface UseSendMessageProps {
  threadId: string;
  speakerId: string;
}

export function useChatHistory({ threadId }: UseChatHistoryProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const cleanup = useCallback(() => {
    console.log("Cleaning up chat subscription");
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    setIsConnected(false);
  }, []);

  const fetchMessages = useCallback(async () => {
    console.log("Fetching messages for thread:", threadId);
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("chat_histories")
        .select(
          `
          *,
          speaker:chat_speakers (
            id,
            name,
            type,
            metadata
          )
        `
        )
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      console.log("Fetched messages:", data?.length || 0);
      setMessages(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch messages")
      );
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  const setupSubscription = useCallback(async () => {
    console.log("Setting up chat subscription for thread:", threadId);
    try {
      cleanup();
      await fetchMessages();

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
          async (payload) => {
            console.log("Received chat event:", payload.eventType, payload);

            if (payload.eventType === "INSERT") {
              // Immediately add the new message to state
              const newMessage: Message = {
                id: payload.new.id,
                message: payload.new.message,
                speaker_id: payload.new.speaker_id,
                thread_id: payload.new.thread_id,
                created_at: payload.new.created_at,
                metadata: payload.new.metadata,
                speaker: null,
              };

              setMessages((prev) => {
                const exists = prev.some((msg) => msg.id === newMessage.id);
                if (exists) return prev;
                return [...prev, newMessage];
              });

              // Then fetch the full message details including speaker
              const { data: fullMessage, error } = await supabase
                .from("chat_histories")
                .select(
                  `
                  *,
                  speaker:chat_speakers (
                    id,
                    name,
                    type,
                    metadata
                  )
                `
                )
                .eq("id", payload.new.id)
                .single();

              if (!error && fullMessage) {
                console.log(
                  "Updating message with speaker details:",
                  fullMessage
                );
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === fullMessage.id ? fullMessage : msg
                  )
                );
              }
            }
          }
        )
        .on("presence", { event: "sync" }, () => {
          console.log("Presence sync event");
          setIsConnected(true);
        })
        .on("presence", { event: "join" }, () => {
          console.log("Presence join event");
          setIsConnected(true);
        })
        .on("presence", { event: "leave" }, () => {
          console.log("Presence leave event");
          setIsConnected(false);
        });

      channelRef.current = channel;

      console.log("Subscribing to channel...");
      const status = await channel.subscribe(async (status) => {
        console.log("Subscription status:", status);

        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          setRetryCount(0);
          setError(null);
          await channel.track({ online_at: new Date().toISOString() });
          console.log("Successfully connected to chat");
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          console.log("Channel closed or error, attempting reconnect");
          setIsConnected(false);
          retryConnection();
        }
      });

      console.log("Initial subscription status:", status);
    } catch (err) {
      console.error("Error setting up subscription:", err);
      setIsConnected(false);
      setError(
        err instanceof Error ? err : new Error("Failed to connect to chat")
      );
      retryConnection();
    }
  }, [threadId, fetchMessages, cleanup]);

  const retryConnection = useCallback(() => {
    if (retryCount >= 3) {
      console.log("Max retry attempts reached");
      toast.error("Could not connect to chat server. Please refresh the page.");
      return;
    }

    const timeout = Math.min(1000 * Math.pow(2, retryCount), 5000);
    console.log(
      `Retrying connection in ${timeout}ms (attempt ${retryCount + 1}/3)`
    );

    retryTimeoutRef.current = setTimeout(() => {
      setRetryCount((prev) => prev + 1);
      setupSubscription();
    }, timeout);
  }, [retryCount, setupSubscription]);

  useEffect(() => {
    console.log("Chat hook mounted, setting up subscription");
    setupSubscription();
    return cleanup;
  }, [threadId, setupSubscription, cleanup]);

  return { messages, loading, error, isConnected };
}

export function useSendMessage({ threadId, speakerId }: UseSendMessageProps) {
  const [sending, setSending] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) {
      return;
    }

    try {
      setSending(true);
      console.log("Sending message:", {
        threadId,
        speakerId,
        messageLength: message.length,
      });

      const { error } = await supabase.from("chat_histories").insert({
        id: uuidv4(),
        message: message.trim(),
        speaker_id: speakerId,
        thread_id: threadId,
        metadata: {},
      });

      if (error) throw error;
      console.log("Message sent successfully");
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
      throw err;
    } finally {
      setSending(false);
    }
  };

  return { sendMessage, sending };
}
