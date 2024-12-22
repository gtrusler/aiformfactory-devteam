from typing import List, Optional, Dict, Any
from supabase import Client, create_client
from langchain.vectorstores import SupabaseVectorStore
from langchain.embeddings import OpenAIEmbeddings
from langchain.schema import Document

class SupabaseStore:
    """Manages vector storage and retrieval using Supabase."""
    
    def __init__(
        self,
        supabase_url: str,
        supabase_key: str,
        table_name: str = "documents",
        embedding_model: str = "text-embedding-3-small"
    ):
        # Initialize Supabase client
        self.supabase: Client = create_client(supabase_url, supabase_key)
        
        # Initialize embeddings
        self.embeddings = OpenAIEmbeddings(
            model=embedding_model,
            openai_api_key="${{ env.OPENAI_API_KEY }}"
        )
        
        # Initialize vector store
        self.vector_store = SupabaseVectorStore(
            client=self.supabase,
            embedding=self.embeddings,
            table_name=table_name,
            query_name="match_documents"
        )
    
    async def add_documents(self, documents: List[Document]) -> None:
        """Add documents to the vector store."""
        await self.vector_store.aadd_documents(documents)
    
    async def similarity_search(
        self,
        query: str,
        k: int = 4,
        metadata_filter: Optional[Dict[str, Any]] = None
    ) -> List[Document]:
        """Search for similar documents."""
        return await self.vector_store.asimilarity_search(
            query,
            k=k,
            filter=metadata_filter
        )
    
    async def delete_documents(
        self,
        ids: Optional[List[str]] = None,
        filter: Optional[Dict[str, Any]] = None
    ) -> None:
        """Delete documents from the vector store."""
        if ids:
            await self.vector_store.adelete(ids=ids)
        elif filter:
            await self.vector_store.adelete(filter=filter)
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """Get statistics about the vector store collection."""
        result = self.supabase.table("documents").select("count(*)").execute()
        return {
            "total_documents": result.data[0]["count"],
            "embedding_model": self.embeddings.model,
            "table_name": self.vector_store.table_name
        } 