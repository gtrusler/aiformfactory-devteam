from typing import Dict, List, Optional
from lib.agents.base.base_agent import BaseAgent, Message

class ConsultationRequest(Message):
    """Structure for consultation requests."""
    request_type: str
    priority: str = "medium"
    context: Optional[Dict] = None
    deadline: Optional[str] = None


class BaseConsultant(BaseAgent):
    """Base class for consultant agents."""
    
    def __init__(
        self,
        name: str,
        expertise: List[str],
        system_prompt: str,
        model_name: str,
        temperature: float = 0.7
    ):
        self.expertise = expertise
        super().__init__(
            name=name,
            system_prompt=self._enhance_prompt(system_prompt),
            model_name=model_name,
            temperature=temperature
        )
    
    def _enhance_prompt(self, base_prompt: str) -> str:
        """Enhance the base prompt with expertise information."""
        expertise_str = "\n".join([f"- {exp}" for exp in self.expertise])
        return f"""{base_prompt}

Your areas of expertise include:
{expertise_str}

When providing consultations:
1. Stay within your areas of expertise
2. Provide clear, actionable advice
3. Cite relevant examples or documentation
4. Highlight any potential risks or trade-offs
5. Suggest alternative approaches when appropriate"""
    
    async def handle_consultation(
        self,
        request: ConsultationRequest
    ) -> Message:
        """Handle a consultation request."""
        # Add consultation metadata
        request.metadata.update({
            "consultation_type": request.request_type,
            "priority": request.priority,
            "consultant": self.name
        })
        
        if request.context:
            request.metadata["context"] = request.context
        
        return await self.process_message(request)
    
    def can_handle_request(self, request_type: str) -> bool:
        """Check if the consultant can handle a specific request type."""
        request_keywords = request_type.lower().split()
        return any(
            any(keyword in exp.lower() for keyword in request_keywords)
            for exp in self.expertise
        ) 