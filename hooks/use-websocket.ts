import { useCallback, useRef } from "react";
import { type ChatMessage, type ChatParticipant } from "@/types/chat";

interface WebSocketCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: ChatMessage) => void;
  onParticipantUpdate?: (participant: ChatParticipant) => void;
}

export function useWebSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const callbacksRef = useRef<WebSocketCallbacks>({});

  const connect = useCallback(
    (callbacks: WebSocketCallbacks) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      callbacksRef.current = callbacks;
      const ws = new WebSocket(url);

      ws.onopen = () => {
        callbacksRef.current.onConnect?.();
      };

      ws.onclose = () => {
        callbacksRef.current.onDisconnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "message") {
            callbacksRef.current.onMessage?.(data.payload);
          } else if (data.type === "participant_update") {
            callbacksRef.current.onParticipantUpdate?.(data.payload);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      wsRef.current = ws;
    },
    [url]
  );

  const disconnect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
  }, []);

  const sendMessage = useCallback(async (message: ChatMessage) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected");
    }

    wsRef.current.send(
      JSON.stringify({
        type: "message",
        payload: message,
      })
    );
  }, []);

  return {
    connect,
    disconnect,
    sendMessage,
  };
}
