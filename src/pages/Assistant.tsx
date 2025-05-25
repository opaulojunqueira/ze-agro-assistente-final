import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChats } from '../hooks/useChats';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSwipeable } from 'react-swipeable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Chat } from '../services/api';
import BottomNavigation from '../components/BottomNavigation';
import { LocalChat } from '../hooks/useChats';

interface ChatItemProps {
  chat: LocalChat;
  index: number;
  totalChats: number;
  onDelete: (chatId: string) => void;
  onClick: (chatId: string) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, index, totalChats, onDelete, onClick }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onDelete(chat._id),
    trackMouse: true
  });

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'agora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const isTyping = chat.lastMessagePreview === "Digitando...";
  const hasUnreadMessages = chat.isUnread || false;
  const isUsersLastMessage = chat.lastMessageSender === 'user';

  return (
    <div {...handlers} className="relative">
      <div 
        onClick={() => onClick(chat._id)}
        className={`p-4 border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer ${
          hasUnreadMessages ? 'animate-pulse-subtle' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-zeagro-green rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <MessageCircle size={20} className="text-white" />
            </div>
            {hasUnreadMessages && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-zeagro-green rounded-full border-2 border-white animate-pulse"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold text-gray-800 truncate ${
                hasUnreadMessages ? 'text-zeagro-green' : ''
              }`}>
                {chat.title}
              </h3>
              <div className="flex items-center gap-2">
                {hasUnreadMessages && !isTyping && (
                  <div className="w-2.5 h-2.5 rounded-full bg-zeagro-green animate-pulse"></div>
                )}
                {isUsersLastMessage && !isTyping && !hasUnreadMessages && (
                  <span className="text-xs text-gray-500">✓</span>
                )}
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(chat.updatedAt)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              {isTyping ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-zeagro-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-zeagro-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-zeagro-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : (
                <p className={`text-sm truncate ${
                  hasUnreadMessages ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}>
                  {chat.lastMessagePreview}
                </p>
              )}
            </div>
            
            {hasUnreadMessages && !isTyping && (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-zeagro-green rounded-full"></div>
                <span className="text-xs text-zeagro-green font-medium">
                  {chat.unreadCount} nova{chat.unreadCount > 1 ? 's' : ''} mensage{chat.unreadCount > 1 ? 'ns' : 'm'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Assistant: React.FC = () => {
  const navigate = useNavigate();
  const { chats, loading, createChat, deleteChat, refetchChats } = useChats();
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  useEffect(() => {
    const handleFocus = () => {
      refetchChats();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refetchChats]);

  const handleNewChat = async () => {
    try {
      const newChat = await createChat();
      navigate(`/chat/${newChat._id}`);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleConversationClick = (conversationId: string) => {
    navigate(`/chat/${conversationId}`);
  };

  const handleDeleteChat = async () => {
    if (!chatToDelete) return;
    try {
      await deleteChat(chatToDelete);
      setChatToDelete(null);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header Skeleton - Fixed */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-zeagro-green to-zeagro-green/90 text-white p-4 shadow-lg rounded-md">
           <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
           <div className="h-4 bg-gray-300 rounded w-32 mt-1 animate-pulse"></div>
        </div>

        {/* Chat List Skeleton - With padding for fixed header */}
        <div className="flex-1 overflow-auto pt-20 p-4 space-y-4">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-md animate-pulse">
               <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
               <div className="flex-1 min-w-0 space-y-2">
                 <div className="h-5 bg-gray-300 rounded w-2/3"></div>
                 <div className="h-4 bg-gray-300 rounded w-full"></div>
               </div>
                <div className="h-4 bg-gray-300 rounded w-12"></div>
             </div>
           ))}
        </div>

         {/* Bottom Navigation Placeholder */}
         <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-300 animate-pulse"></div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-zeagro-green to-zeagro-green/90 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Assistente Virtual</h1>
            <p className="text-sm opacity-90">Suas conversas</p>
          </div>
        </div>
      </div>

      {/* Main Content - With padding for fixed header */}
      <div className="flex-1 overflow-auto pt-20">
        {/* Conversations List */}
        <div className="p-4">
          {chats.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {chats.map((chat, index) => (
                <ChatItem
                  key={chat._id}
                  chat={chat}
                  index={index}
                  totalChats={chats.length}
                  onDelete={setChatToDelete}
                  onClick={handleConversationClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Nenhuma conversa ainda
              </h3>
              <p className="text-gray-500 mb-6">
                Inicie uma conversa com o assistente virtual
              </p>
              <button 
                onClick={handleNewChat}
                className="bg-zeagro-green text-white px-6 py-3 rounded-xl font-medium hover:bg-zeagro-green/90 transition-colors shadow-md"
              >
                Nova Conversa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      {chats.length > 0 && (
        <button 
          onClick={handleNewChat}
          className="fixed bottom-24 right-6 bg-zeagro-green text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-zeagro-green/90 transition-all duration-200"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!chatToDelete} onOpenChange={() => setChatToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conversa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChat}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Assistant;
