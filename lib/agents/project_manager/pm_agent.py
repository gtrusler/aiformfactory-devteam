from typing import List, Optional
from langchain.tools import BaseTool
from lib.agents.base.base_agent import BaseAgent, Message

class ProjectManagerAgent(BaseAgent):
    """Project Manager agent for coordinating development tasks."""
    
    def __init__(
        self,
        tools: Optional[List[BaseTool]] = None,
        model_name: str = "claude-3-opus-20240229",
        temperature: float = 0.7
    ):
        system_prompt = """You are an expert Project Manager AI assistant focused on coordinating software development tasks.
        Your responsibilities include:
        - Breaking down complex tasks into manageable steps
        - Providing clear technical guidance and best practices
        - Tracking progress and maintaining documentation
        - Identifying potential risks and dependencies
        - Ensuring code quality and maintainability
        
        Always maintain a professional and constructive tone. Base your responses on software development best practices
        and the specific context of the project. When providing guidance, be specific and actionable.
        """
        
        super().__init__(
            name="ProjectManager",
            system_prompt=system_prompt,
            tools=tools,
            model_name=model_name,
            temperature=temperature
        )
    
    async def process_message(self, message: Message) -> Message:
        """Process incoming message with PM-specific handling."""
        # Add PM-specific metadata
        message.metadata["context"] = "project_management"
        message.metadata["priority"] = self._assess_priority(message.content)
        
        return await super().process_message(message)
    
    def _assess_priority(self, content: str) -> str:
        """Assess the priority of a message based on content."""
        # Simple priority assessment - can be enhanced
        priority_keywords = {
            "high": ["urgent", "critical", "blocker", "immediate"],
            "medium": ["important", "significant", "needed"],
            "low": ["minor", "when possible", "not urgent"]
        }
        
        content_lower = content.lower()
        for priority, keywords in priority_keywords.items():
            if any(keyword in content_lower for keyword in keywords):
                return priority
        
        return "medium"  # Default priority 