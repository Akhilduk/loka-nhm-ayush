import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (content: string, type?: 'text' | 'file') => void;
  clearMessages: () => void;
  isConnected: boolean;
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  sendMessage: () => {},
  clearMessages: () => {},
  isConnected: false,
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('your_socket_server_url');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = (content: string, type: 'text' | 'file' = 'text') => {
    if (socket && content.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'user', // Replace with actual user ID
        content,
        timestamp: new Date().toISOString(),
        type,
      };

      socket.emit('message', message);
      setMessages((prev) => [...prev, message]);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        clearMessages,
        isConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);