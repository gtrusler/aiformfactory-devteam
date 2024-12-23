"use client";

import { useEffect, useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";

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

interface MessageThreadProps {
  messages: Message[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function MessageThread({
  messages,
  isLoading = false,
  error = null,
}: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (error) {
    return (
      <Alert variant="destructive">
        <p>Error loading messages: {error.message}</p>
      </Alert>
    );
  }

  return (
    <ScrollArea ref={scrollRef} className="h-[calc(100vh-12rem)]">
      <div className="flex flex-col space-y-4 p-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))
          : messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  {message.sender.avatar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={message.sender.avatar}
                      alt={message.sender.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-sm font-medium">
                      {message.sender.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{message.content}</p>
                </div>
              </div>
            ))}
      </div>
    </ScrollArea>
  );
}
