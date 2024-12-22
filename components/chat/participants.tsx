import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ChatParticipant } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ParticipantListProps {
  participants: ChatParticipant[];
  className?: string;
}

export function ParticipantList({
  participants,
  className,
}: ParticipantListProps) {
  const getStatusColor = (status: ChatParticipant["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h3 className="text-sm font-semibold">Participants</h3>
      <div className="flex flex-wrap gap-2">
        {participants.map((participant) => (
          <TooltipProvider key={participant.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={participant.avatar}
                      alt={participant.name}
                    />
                    <AvatarFallback>
                      {participant.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                      getStatusColor(participant.status)
                    )}
                  />
                  {participant.isTyping && (
                    <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 animate-bounce rounded-full bg-primary" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">{participant.name}</span>
                  <span className="text-xs capitalize text-muted-foreground">
                    {participant.role} • {participant.status}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
