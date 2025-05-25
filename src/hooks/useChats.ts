import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Chat, ChatMessage } from '../services/api';
import { useToast } from './use-toast';

const UNREAD_CHATS_KEY = 'zeagro_unread_chats';

// Extend the Chat interface to include local state properties
export interface LocalChat extends Chat {
  isUnread?: boolean; // Add isUnread flag for local state management
  isTyping?: boolean; // Add isTyping flag for local state management
  lastMessageSender?: 'user' | 'bot'; // Add sender info for last message preview
}

export const useChats = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Função para carregar chats não lidos do localStorage - used only once for initial state
  const loadUnreadChats = useCallback(() => {
    try {
      const stored = localStorage.getItem(UNREAD_CHATS_KEY);
      return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
    } catch {
      console.error('Erro ao carregar chats não lidos do localStorage:', error);
      return new Set<string>();
    }
  }, []);

  const [chats, setChats] = useState<LocalChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typingChats, setTypingChats] = useState<Set<string>>(new Set());
  // unreadChatIds is the source of truth for unread status, synced with localStorage
  const [unreadChatIds, setUnreadChatIds] = useState<Set<string>>(() => loadUnreadChats());

  // Função para salvar chats não lidos no localStorage
  const saveUnreadChats = useCallback((unreadChats: Set<string>) => {
    try {
      localStorage.setItem(UNREAD_CHATS_KEY, JSON.stringify(Array.from(unreadChats)));
    } catch (error) {
      console.error('Erro ao salvar chats não lidos:', error);
    }
  }, []);

  const loadChats = useCallback(async () => {
    if (!currentUser) {
      setChats([]);
      setLoading(false);
      return;
    }

    try {
      const data = await apiService.getChats();
      
      // Map API chats and add local state properties (isUnread, isTyping)
      const chatsWithLocalStatus: LocalChat[] = data.map((chat: Chat) => ({
        ...chat,
        // Determine isTyping based on local typingChats set
        isTyping: typingChats.has(chat._id),
        // Determine isUnread based on local unreadChatIds set
        isUnread: unreadChatIds.has(chat._id),
        // Ensure unreadCount reflects isUnread (useful for displaying count in UI if needed)
        unreadCount: unreadChatIds.has(chat._id) ? 1 : 0,
        // Initialize lastMessageSender - will be updated by sendMessage/simulateBotTyping
        lastMessageSender: undefined, // Or derive from initial messages if available
      }));
      
      setChats(chatsWithLocalStatus);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar conversas');
      console.error('Erro ao carregar conversas:', err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as conversas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser, typingChats, unreadChatIds, toast]);

  // Efeito para polling dos chats
  useEffect(() => {
    if (!currentUser) return;

    // Carrega os chats imediatamente
    loadChats();

    // Configura o polling a cada 5 segundos
    const intervalId = setInterval(loadChats, 5000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, [currentUser, loadChats]);

  const createChat = async () => {
    try {
      const newChat = await apiService.createChat();
      setChats(prev => [newChat, ...prev]);
      return newChat;
    } catch (err) {
      setError('Erro ao criar conversa');
      console.error('Erro ao criar conversa:', err);
      toast({
        title: "Erro",
        description: "Não foi possível criar uma nova conversa",
        variant: "destructive",
      });
      throw err;
    }
  };

  const getChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
    try {
      // Marca o chat como lido localmente e no localStorage
      setUnreadChatIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(chatId);
        saveUnreadChats(newSet);
        return newSet;
      });

      // Atualiza o estado local de chats para marcar este como lido
      setChats(prev => prev.map((chat: LocalChat) => {
        if (chat._id === chatId) {
          return { ...chat, isUnread: false, unreadCount: 0 };
        }
        return chat;
      }));

      const messages = await apiService.getChatMessages(chatId);
      return messages;

    } catch (error) {
      console.error('Error fetching chat messages:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens",
        variant: "destructive",
      });
      throw error;
    }
  };

  const sendMessage = async (chatId: string, text: string): Promise<ChatMessage> => {
    try {
      const botResponse = await apiService.sendMessage(chatId, text);
      
      // Update chat in the list, mark as read, set user's message preview and sender, and move it to top
      setChats(prev => {
        const updatedChats: LocalChat[] = prev.map((chat: LocalChat) => {
          if (chat._id === chatId) {
            const userMessagePreview = text;
            
            return {
              ...chat,
              lastMessagePreview: userMessagePreview,
              lastMessageTimestamp: new Date().toISOString(),
              isUnread: false,
              unreadCount: 0,
              updatedAt: new Date().toISOString(),
              lastMessageSender: 'user',
            };
          }
          return chat;
        });
        return updatedChats.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
      
      // Ensure it's removed from unreadChatIds in localStorage and state if it was there
      setUnreadChatIds(prev => {
        const newSet = new Set(prev);
        if(newSet.has(chatId)) {
          newSet.delete(chatId);
          saveUnreadChats(newSet);
        }
        return newSet;
      });

      // Note: The simulateBotTyping function will be responsible for updating the preview
      // and sender to the bot's response after a delay.

      return botResponse; // Still return botResponse as before

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await apiService.deleteChat(chatId);
      
      // Remove o chat da lista de não lidos (local e localStorage)
      const unreadChats = new Set(unreadChatIds); // Use local state
      unreadChats.delete(chatId);
      setUnreadChatIds(unreadChats); // Update local state
      saveUnreadChats(unreadChats); // Save to localStorage
      
      setChats(prev => prev.filter((chat: LocalChat) => chat._id !== chatId));
      setTypingChats(prev => {
        const newSet = new Set(prev);
        newSet.delete(chatId);
        return newSet;
      });
      
      toast({
        title: "Sucesso!",
        description: "Conversa excluída com sucesso",
      });
    } catch (err) {
      setError('Erro ao excluir conversa');
      console.error('Erro ao excluir conversa:', err);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conversa",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Função para simular o bot digitando
  const simulateBotTyping = (chatId: string) => {
    const now = new Date().toISOString();
    setTypingChats(prev => new Set(prev).add(chatId));
    
    // Marca o chat como não lido (local e localStorage) quando o bot começa a digitar
    setUnreadChatIds(prev => {
      const newSet = new Set(prev);
      newSet.add(chatId);
      saveUnreadChats(newSet);
      return newSet;
    });
    
    setChats(prev => prev.map((chat: LocalChat) => {
      if (chat._id === chatId) {
        return {
          ...chat,
          lastMessagePreview: "Digitando...",
          isUnread: true, // Mark as unread when bot starts typing
          unreadCount: 1, // Reflect in unreadCount
          updatedAt: now,
          lastMessageSender: 'bot', // Mark last message sender as bot when typing starts (anticipating bot response)
        };
      }
      return chat;
    }));

    // Remove o status de digitação após 2 segundos
    setTimeout(() => {
      setTypingChats(prev => {
        const newSet = new Set(prev);
        newSet.delete(chatId);
        return newSet;
      });
      
      setChats(prev => prev.map((chat: LocalChat) => {
        if (chat._id === chatId) {
          // Ensure isUnread and unreadCount are correctly derived from unreadChatIds after typing stops
          const updatedChat: LocalChat = {
            ...chat,
            lastMessagePreview: chat.lastMessagePreview === "Digitando..." ? "Mensagem recebida" : chat.lastMessagePreview,
            updatedAt: new Date().toISOString(),
             lastMessageSender: 'bot',
          };
          // Explicitly set isUnread and unreadCount based on the source of truth (unreadChatIds)
          updatedChat.isUnread = unreadChatIds.has(chat._id);
          updatedChat.unreadCount = updatedChat.isUnread ? 1 : 0;

          return updatedChat;
        }
        return chat;
      }));

    }, 2000);
  };

  return {
    chats,
    loading,
    error,
    createChat,
    getChatMessages,
    sendMessage,
    deleteChat,
    simulateBotTyping,
    refetchChats: loadChats
  };
};
