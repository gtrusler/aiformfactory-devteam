from typing import List, Dict, Any, Optional
from datetime import datetime
from supabase import Client, create_client
from lib.agents.base.base_agent import Message

class ChatHistoryManager:
    """Manages chat history storage and retrieval using Supabase."""
    
    def __init__(
        self,
        supabase_url: str,
        supabase_key: str,
        table_name: str = "chat_history"
    ):
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.table_name = table_name
    
    async def add_message(self, message: Message) -> None:
        """Add a message to the chat history."""
        message_data = {
            "content": message.content,
            "speaker_id": message.speaker_id,
            "timestamp": message.timestamp or datetime.utcnow().isoformat(),
            "metadata": message.metadata or {}
        }
        
        await self.supabase.table(self.table_name).insert(message_data).execute()
    
    async def get_chat_history(
        self,
        limit: int = 100,
        speaker_id: Optional[str] = None,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None
    ) -> List[Message]:
        """Retrieve chat history with optional filters."""
        query = self.supabase.table(self.table_name).select("*")
        
        if speaker_id:
            query = query.eq("speaker_id", speaker_id)
        if start_time:
            query = query.gte("timestamp", start_time)
        if end_time:
            query = query.lte("timestamp", end_time)
        
        query = query.order("timestamp", desc=True).limit(limit)
        result = await query.execute()
        
        return [
            Message(
                content=row["content"],
                speaker_id=row["speaker_id"],
                timestamp=row["timestamp"],
                metadata=row["metadata"]
            )
            for row in result.data
        ]
    
    async def delete_chat_history(
        self,
        before_time: Optional[str] = None,
        speaker_id: Optional[str] = None
    ) -> None:
        """Delete chat history with optional filters."""
        query = self.supabase.table(self.table_name)
        
        if before_time:
            query = query.lte("timestamp", before_time)
        if speaker_id:
            query = query.eq("speaker_id", speaker_id)
        
        await query.delete().execute()
    
    async def get_conversation_summary(
        self,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get summary statistics about the conversation."""
        query = self.supabase.table(self.table_name).select("*")
        
        if start_time:
            query = query.gte("timestamp", start_time)
        if end_time:
            query = query.lte("timestamp", end_time)
        
        result = await query.execute()
        
        speakers = {}
        for row in result.data:
            speaker = row["speaker_id"]
            speakers[speaker] = speakers.get(speaker, 0) + 1
        
        return {
            "total_messages": len(result.data),
            "unique_speakers": len(speakers),
            "messages_per_speaker": speakers,
            "time_range": {
                "start": start_time or result.data[0]["timestamp"],
                "end": end_time or result.data[-1]["timestamp"]
            }
        } 