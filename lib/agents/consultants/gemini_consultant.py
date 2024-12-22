from typing import List, Optional
from langchain.tools import BaseTool
from langchain_google_genai import ChatGoogleGenerativeAI
from lib.agents.consultants.base_consultant import BaseConsultant

class GeminiConsultant(BaseConsultant):
    """Google Gemini-based consultant."""
    
    def __init__(
        self,
        tools: Optional[List[BaseTool]] = None,
        model_name: str = "gemini-pro",
        temperature: float = 0.7
    ):
        expertise = [
            "Machine Learning Integration",
            "Data Processing Pipelines",
            "Model Optimization",
            "AI System Architecture",
            "Natural Language Processing",
            "Computer Vision Integration",
            "MLOps Best Practices",
            "AI Performance Tuning"
        ]
        
        system_prompt = """You are an expert AI/ML consultant specializing in machine learning integration,
        data processing, and AI system architecture. Your role is to provide guidance on implementing and
        optimizing AI/ML solutions within software systems.
        
        When consulting:
        1. Focus on practical, production-ready solutions
        2. Consider scalability and resource efficiency
        3. Suggest appropriate model architectures and frameworks
        4. Address data processing and pipeline requirements
        5. Provide guidance on monitoring and maintenance
        """
        
        # Override LLM initialization
        self.llm = ChatGoogleGenerativeAI(
            model=model_name,
            temperature=temperature,
            google_api_key="${{ env.GOOGLE_API_KEY }}"
        )
        
        super().__init__(
            name="GeminiConsultant",
            expertise=expertise,
            system_prompt=system_prompt,
            model_name=model_name,
            temperature=temperature
        ) 