"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

const defaultAgents: Agent[] = [
  {
    id: "AI",
    name: "AI Assistant",
    role: "General Assistant",
  },
  {
    id: "PM",
    name: "Project Manager",
    role: "Project Management",
  },
  {
    id: "DEV",
    name: "Developer",
    role: "Technical Support",
  },
];

interface AgentListProps {
  selectedAgentId: string;
  onAgentSelect: (agentId: string) => void;
}

export function AgentList({ selectedAgentId, onAgentSelect }: AgentListProps) {
  const [agents] = useState<Agent[]>(defaultAgents);
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <div className="p-4">
        <p className="text-sm text-destructive">
          Error loading agents: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-semibold mb-4">Available Agents</h2>
      {agents.map((agent) => (
        <Button
          key={agent.id}
          variant={selectedAgentId === agent.id ? "default" : "ghost"}
          className={cn(
            "w-full justify-start text-left",
            selectedAgentId === agent.id && "bg-primary text-primary-foreground"
          )}
          onClick={() => onAgentSelect(agent.id)}
        >
          <div className="flex flex-col items-start">
            <span className="font-medium">{agent.name}</span>
            <span className="text-xs text-muted-foreground">{agent.role}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}
