import { supabase } from "@/lib/supabase/client";
import type { ChatHistory, ChatSpeaker } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

export class ChatHistoryService {
  async createMessage({
    message,
    speakerId,
    threadId,
    parentMessageId,
    metadata = {},
  }: {
    message: string;
    speakerId: string;
    threadId: string;
    parentMessageId?: string;
    metadata?: Record<string, any>;
  }): Promise<ChatHistory> {
    const { data, error } = await supabase
      .from("n8n_chat_histories")
      .insert({
        id: uuidv4(),
        message,
        speaker_id: speakerId,
        thread_id: threadId,
        parent_message_id: parentMessageId,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getThreadMessages(threadId: string): Promise<ChatHistory[]> {
    const { data, error } = await supabase
      .from("n8n_chat_histories")
      .select("*, speaker:chat_speakers(*)")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  }

  async getMessageContext(
    messageId: string,
    limit = 5
  ): Promise<ChatHistory[]> {
    const { data, error } = await supabase
      .from("n8n_chat_histories")
      .select("*, speaker:chat_speakers(*)")
      .eq("parent_message_id", messageId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async subscribeToThread(
    threadId: string,
    callback: (payload: ChatHistory) => void
  ) {
    return supabase
      .channel(`thread:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "n8n_chat_histories",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => callback(payload.new as ChatHistory)
      )
      .subscribe();
  }

  async getSpeaker(speakerId: string): Promise<ChatSpeaker> {
    const { data, error } = await supabase
      .from("chat_speakers")
      .select("*")
      .eq("id", speakerId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateMessageMetadata(
    messageId: string,
    metadata: Record<string, any>
  ): Promise<void> {
    const { error } = await supabase
      .from("n8n_chat_histories")
      .update({ metadata })
      .eq("id", messageId);

    if (error) throw error;
  }
}
