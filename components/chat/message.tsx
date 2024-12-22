import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type ChatMessage, type ChatParticipant } from "@/types/chat";
import { FileIcon, XCircleIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface MessageProps {
  message: ChatMessage;
  participant: ChatParticipant;
  isLastMessage?: boolean;
}

export function Message({ message, participant, isLastMessage }: MessageProps) {
  const isUser = participant.role === "user";
  const timestamp = message.timestamp
    ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })
    : "";

  return (
    <div
      className={cn(
        "flex w-full gap-3 p-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={participant.avatar} alt={participant.name} />
        <AvatarFallback>
          {participant.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{participant.name}</span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>

        {message.isLoading ? (
          <Skeleton className="h-16 w-[300px]" />
        ) : (
          <Card
            className={cn(
              "overflow-hidden",
              isUser ? "bg-primary text-primary-foreground" : ""
            )}
          >
            <CardContent className="p-3">
              {message.error ? (
                <div className="flex items-center gap-2 text-destructive">
                  <XCircleIcon className="h-4 w-4" />
                  <span>{message.error}</span>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </CardContent>
          </Card>
        )}

        {message.files && message.files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.files.map((file) => (
              <Card
                key={file.id}
                className={cn(
                  "flex items-center gap-2 p-2",
                  isUser ? "bg-primary text-primary-foreground" : ""
                )}
              >
                <FileIcon className="h-4 w-4" />
                <span className="text-sm">{file.name}</span>
                {file.uploadProgress !== undefined &&
                  file.uploadProgress < 100 && (
                    <span className="text-xs">({file.uploadProgress}%)</span>
                  )}
                {file.error && (
                  <XCircleIcon className="h-4 w-4 text-destructive" />
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
