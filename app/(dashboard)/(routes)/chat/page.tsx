import { ChatContainer } from "@/components/chat/container";

const initialParticipants = [
  {
    id: "user",
    name: "You",
    role: "user" as const,
    status: "online" as const,
  },
  {
    id: "pm",
    name: "Project Manager",
    role: "agent" as const,
    status: "online" as const,
  },
  {
    id: "openai",
    name: "OpenAI Consultant",
    role: "consultant" as const,
    status: "online" as const,
  },
  {
    id: "gemini",
    name: "Gemini Consultant",
    role: "consultant" as const,
    status: "online" as const,
  },
  {
    id: "liaison",
    name: "Coding Liaison",
    role: "liaison" as const,
    status: "online" as const,
  },
];

export default function ChatPage() {
  return (
    <div className="-m-6 flex h-[calc(100vh-4rem)]">
      <ChatContainer
        websocketUrl={process.env.NEXT_PUBLIC_WEBSOCKET_URL!}
        initialParticipants={initialParticipants}
      />
    </div>
  );
}
