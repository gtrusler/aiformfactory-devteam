import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

type SpeakerType = "human" | "assistant" | "system";

interface Speaker {
  id: string;
  name: string;
  type: SpeakerType;
  metadata?: {
    role?: string;
    avatar?: string | null;
  };
}

interface MessageProps {
  message: {
    content: string;
    timestamp?: string;
    isLoading?: boolean;
  };
  participant: Speaker;
  isLastMessage?: boolean;
}

export function Message({ message, participant, isLastMessage }: MessageProps) {
  const isUser = participant.type === "human";
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
        <AvatarImage src={participant.metadata?.avatar || undefined} alt={participant.name} />
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
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <CardContent className="p-3">
              <p className="whitespace-pre-wrap">{message.content}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
