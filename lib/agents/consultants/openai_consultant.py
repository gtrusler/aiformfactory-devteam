from typing import List, Optional
from langchain.tools import BaseTool
from langchain_openai import ChatOpenAI
from lib.agents.consultants.base_consultant import BaseConsultant

class OpenAIConsultant(BaseConsultant):
    """OpenAI-based consultant using GPT-4."""
    
    def __init__(
        self,
        tools: Optional[List[BaseTool]] = None,
        model_name: str = "gpt-4-0125-preview",
        temperature: float = 0.7
    ):
        expertise = [
            "Architecture Design",
            "Code Review",
            "Performance Optimization",
            "Security Best Practices",
            "API Design",
            "Testing Strategies",
            "Database Design",
            "System Integration"
        ]
        
        system_prompt = """You are an expert software development consultant with deep expertise in system design,
        architecture, and best practices. Your role is to provide detailed technical guidance, review proposed solutions,
        and suggest improvements.
        
        When consulting:
        1. Analyze problems thoroughly before providing solutions
        2. Consider scalability, maintainability, and security implications
        3. Provide concrete examples and code snippets when relevant
        4. Reference industry standards and best practices
        5. Suggest testing and validation approaches
        """
        
        # Override LLM initialization
        self.llm = ChatOpenAI(
            model=model_name,
            temperature=temperature,
            openai_api_key="${{ env.OPENAI_API_KEY }}"
        )
        
        super().__init__(
            name="OpenAIConsultant",
            expertise=expertise,
            system_prompt=system_prompt,
            model_name=model_name,
            temperature=temperature
        ) 