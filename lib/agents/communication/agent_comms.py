from typing import Dict, List, Optional, Type
from lib.agents.base.base_agent import BaseAgent, Message
from lib.agents.consultants.base_consultant import ConsultationRequest
from lib.agents.liaison.coding_liaison import StatusReport

class AgentCommunicationManager:
    """Manages communication between different agents."""
    
    def __init__(self):
        self.agents: Dict[str, BaseAgent] = {}
        self.routes: Dict[str, List[str]] = {}
        self.message_queue: List[Dict] = []
    
    def register_agent(self, agent: BaseAgent) -> None:
        """Register an agent with the communication manager."""
        self.agents[agent.name] = agent
    
    def add_route(self, from_agent: str, to_agents: List[str]) -> None:
        """Add a communication route between agents."""
        if from_agent not in self.agents:
            raise ValueError(f"Unknown source agent: {from_agent}")
        
        for agent in to_agents:
            if agent not in self.agents:
                raise ValueError(f"Unknown destination agent: {agent}")
        
        self.routes[from_agent] = to_agents
    
    async def send_consultation_request(
        self,
        from_agent: str,
        request_type: str,
        content: str,
        priority: str = "medium",
        context: Optional[Dict] = None
    ) -> List[Message]:
        """Send a consultation request to appropriate consultants."""
        if from_agent not in self.agents:
            raise ValueError(f"Unknown source agent: {from_agent}")
        
        # Create consultation request
        request = ConsultationRequest(
            content=content,
            speaker_id=from_agent,
            request_type=request_type,
            priority=priority,
            context=context
        )
        
        responses = []
        # Find consultants who can handle this request
        for agent_name, agent in self.agents.items():
            if (
                agent_name in self.routes.get(from_agent, []) and
                hasattr(agent, 'can_handle_request') and
                agent.can_handle_request(request_type)
            ):
                response = await agent.handle_consultation(request)
                responses.append(response)
        
        return responses
    
    async def broadcast_status_report(
        self,
        report: StatusReport,
        from_agent: str
    ) -> None:
        """Broadcast a status report to connected agents."""
        if from_agent not in self.agents:
            raise ValueError(f"Unknown source agent: {from_agent}")
        
        target_agents = self.routes.get(from_agent, [])
        for agent_name in target_agents:
            agent = self.agents[agent_name]
            # Queue the message for processing
            self.message_queue.append({
                "type": "status_report",
                "content": report,
                "from": from_agent,
                "to": agent_name
            })
    
    async def process_message_queue(self) -> None:
        """Process queued messages."""
        while self.message_queue:
            message = self.message_queue.pop(0)
            agent = self.agents[message["to"]]
            
            if message["type"] == "status_report":
                await agent.process_message(message["content"])
    
    def get_agent_connections(self, agent_name: str) -> Dict[str, List[str]]:
        """Get information about an agent's connections."""
        if agent_name not in self.agents:
            raise ValueError(f"Unknown agent: {agent_name}")
        
        return {
            "outgoing": self.routes.get(agent_name, []),
            "incoming": [
                name for name, routes in self.routes.items()
                if agent_name in routes
            ]
        } 