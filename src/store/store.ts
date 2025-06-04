import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  messages: Message[];
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

interface AppState {
  chats: Record<string, Chat>;
  notifications: Notification[];
  addChat: (participantIds: string[]) => string;
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp' | 'status'>) => void;
  markMessageAsRead: (chatId: string, messageId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
}

export const useStore = create<AppState>((set) => ({
  chats: {},
  notifications: [],

  addChat: (participantIds) => {
    const chatId = uuidv4();
    set((state) => ({
      chats: {
        ...state.chats,
        [chatId]: {
          id: chatId,
          messages: [],
          participants: participantIds,
          unreadCount: 0,
        },
      },
    }));
    return chatId;
  },

  addMessage: (chatId, message) => {
    set((state) => {
      const chat = state.chats[chatId];
      if (!chat) return state;

      const newMessage: Message = {
        ...message,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        status: 'sent',
      };

      return {
        chats: {
          ...state.chats,
          [chatId]: {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: newMessage,
            unreadCount: chat.unreadCount + 1,
          },
        },
      };
    });
  },

  markMessageAsRead: (chatId, messageId) => {
    set((state) => {
      const chat = state.chats[chatId];
      if (!chat) return state;

      return {
        chats: {
          ...state.chats,
          [chatId]: {
            ...chat,
            messages: chat.messages.map((msg) =>
              msg.id === messageId ? { ...msg, status: 'read' as const } : msg
            ),
            unreadCount: Math.max(0, chat.unreadCount - 1),
          },
        },
      };
    });
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    }));
  },

  markNotificationAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));