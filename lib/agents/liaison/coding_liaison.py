from typing import Dict, List, Optional
from datetime import datetime
from langchain.tools import BaseTool
from lib.agents.base.base_agent import BaseAgent, Message

class StatusReport(Message):
    """Structure for status reports."""
    report_type: str
    progress: Dict[str, str]
    blockers: Optional[List[str]] = None
    next_steps: List[str]
    recommendations: Optional[List[str]] = None

class CodingLiaison(BaseAgent):
    """Liaison agent for coordinating between human developers and AI agents."""
    
    def __init__(
        self,
        tools: Optional[List[BaseTool]] = None,
        model_name: str = "claude-3-opus-20240229",
        temperature: float = 0.7
    ):
        system_prompt = """You are an expert coding liaison responsible for facilitating communication between
        human developers and AI agents. Your role is to ensure clear understanding, proper formatting of
        instructions, and effective coordination of development tasks.
        
        Your responsibilities include:
        1. Formatting and clarifying coding instructions
        2. Generating structured status reports
        3. Coordinating between different AI consultants
        4. Maintaining consistent communication patterns
        5. Tracking task progress and dependencies
        """
        
        super().__init__(
            name="CodingLiaison",
            system_prompt=system_prompt,
            tools=tools,
            model_name=model_name,
            temperature=temperature
        )
        
        self.status_template = {
            "task_update": self._task_update_template,
            "code_review": self._code_review_template,
            "blocker_report": self._blocker_report_template
        }
    
    def _task_update_template(self, data: Dict) -> str:
        """Generate a task update report."""
        return f"""
# Task Update Report

## Overview
Task: {data.get('task_name')}
Status: {data.get('status')}
Last Updated: {datetime.utcnow().isoformat()}

## Progress
{self._format_progress(data.get('progress', {}))}

## Next Steps
{self._format_list(data.get('next_steps', []))}

## Notes
{data.get('notes', 'No additional notes.')}
"""
    
    def _code_review_template(self, data: Dict) -> str:
        """Generate a code review report."""
        return f"""
# Code Review Report

## Files Reviewed
{self._format_list(data.get('files', []))}

## Summary
{data.get('summary')}

## Findings
### Strengths
{self._format_list(data.get('strengths', []))}

### Areas for Improvement
{self._format_list(data.get('improvements', []))}

## Recommendations
{self._format_list(data.get('recommendations', []))}
"""
    
    def _blocker_report_template(self, data: Dict) -> str:
        """Generate a blocker report."""
        return f"""
# Blocker Report

## Current Blockers
{self._format_blockers(data.get('blockers', []))}

## Impact Assessment
{data.get('impact', 'Impact assessment not provided.')}

## Proposed Solutions
{self._format_list(data.get('solutions', []))}

## Required Actions
{self._format_list(data.get('required_actions', []))}
"""
    
    def _format_progress(self, progress: Dict[str, str]) -> str:
        """Format progress items."""
        return "\n".join([f"- {task}: {status}" for task, status in progress.items()])
    
    def _format_list(self, items: List[str]) -> str:
        """Format a list of items."""
        return "\n".join([f"- {item}" for item in items]) if items else "None"
    
    def _format_blockers(self, blockers: List[Dict]) -> str:
        """Format blocker information."""
        formatted = []
        for blocker in blockers:
            formatted.append(f"""### {blocker.get('title')}
- Description: {blocker.get('description')}
- Severity: {blocker.get('severity', 'Unknown')}
- Affected Areas: {', '.join(blocker.get('affected_areas', []))}""")
        return "\n\n".join(formatted) if formatted else "No blockers reported."
    
    async def generate_status_report(
        self,
        report_type: str,
        data: Dict
    ) -> StatusReport:
        """Generate a formatted status report."""
        template = self.status_template.get(report_type)
        if not template:
            raise ValueError(f"Unknown report type: {report_type}")
        
        content = template(data)
        return StatusReport(
            content=content,
            speaker_id=self.name,
            report_type=report_type,
            progress=data.get('progress', {}),
            blockers=data.get('blockers', []),
            next_steps=data.get('next_steps', []),
            recommendations=data.get('recommendations', [])
        ) 