"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AgentListProps {
  selectedAgentId: string;
  onAgentSelect: (agentId: string) => void;
}

const AGENTS = [
  {
    id: "AI",
    name: "AI Assistant",
    description: "General Assistant",
  },
  {
    id: "PM",
    name: "Project Manager",
    description: "Project Management",
  },
  {
    id: "DEV",
    name: "Developer",
    description: "Technical Support",
  },
];

export function AgentList({ selectedAgentId, onAgentSelect }: AgentListProps) {
  return (
    <div className="flex gap-2">
      {AGENTS.map((agent) => (
        <Button
          key={agent.id}
          variant={selectedAgentId === agent.id ? "default" : "outline"}
          className={cn(
            "flex flex-col items-start gap-1 h-auto p-4",
            selectedAgentId === agent.id && "bg-primary text-primary-foreground"
          )}
          onClick={() => onAgentSelect(agent.id)}
        >
          <span className="text-sm font-medium">{agent.name}</span>
          <span className="text-xs text-muted-foreground">
            {agent.description}
          </span>
        </Button>
      ))}
    </div>
  );
}
