from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from langchain.agents import AgentExecutor
from langchain.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic
from langchain.tools import BaseTool

class Message(BaseModel):
    """Message structure for agent communication."""
    content: str
    speaker_id: str
    timestamp: Optional[str] = None
    metadata: Optional[Dict] = Field(default_factory=dict)

class BaseAgent:
    """Base agent class implementing core functionality."""
    
    def __init__(
        self,
        name: str,
        system_prompt: str,
        tools: Optional[List[BaseTool]] = None,
        model_name: str = "claude-3-opus-20240229",
        temperature: float = 0.7
    ):
        self.name = name
        self.system_prompt = system_prompt
        self.tools = tools or []
        self.chat_history: List[Message] = []
        
        # Initialize LLM
        self.llm = ChatAnthropic(
            model=model_name,
            temperature=temperature,
            anthropic_api_key="${{ env.ANTHROPIC_API_KEY }}"
        )
        
        # Create prompt template
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("human", "{input}"),
        ])
        
        # Initialize agent executor
        self.agent_executor = self._create_agent_executor()
    
    def _create_agent_executor(self) -> AgentExecutor:
        """Create the agent executor with tools and chain."""
        return AgentExecutor.from_agent_and_tools(
            agent=self.llm,
            tools=self.tools,
            handle_parsing_errors=True
        )
    
    async def process_message(self, message: Message) -> Message:
        """Process incoming message and return response."""
        # Add message to chat history
        self.chat_history.append(message)
        
        # Process message with agent
        response = await self.agent_executor.ainvoke({
            "input": message.content,
            "chat_history": self.chat_history
        })
        
        # Create response message
        response_message = Message(
            content=response["output"],
            speaker_id=self.name
        )
        
        # Add response to chat history
        self.chat_history.append(response_message)
        
        return response_message
    
    def get_chat_history(self) -> List[Message]:
        """Return the agent's chat history."""
        return self.chat_history 