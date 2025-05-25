import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChats } from '../hooks/useChats';
import { ChatMessage } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { chats, getChatMessages, sendMessage, createChat } = useChats();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Scroll to bottom when the number of messages changes
    scrollToBottom();

    // Add a small delay to ensure the DOM is updated before scrolling (fallback)
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);

    // Clear the timer if the component unmounts or messages change again
    return () => clearTimeout(timer);

  }, [messages.length, isTyping]); // Depend on messages.length and isTyping

  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) return;

      try {
        setLoading(true);
        
        if (conversationId === 'new') {
          // Create new chat
          const newChat = await createChat();
          navigate(`/chat/${newChat._id}`, { replace: true });
          return;
        }

        // Load existing chat messages
        const chatMessages = await getChatMessages(conversationId);
        setMessages(chatMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !conversationId || conversationId === 'new') return;

    const userMessage: ChatMessage = {
      _id: Date.now().toString(),
      senderId: 'user',
      text: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const botResponse = await sendMessage(conversationId, inputMessage);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch {
      return 'Agora';
    }
  };

  const getConversationTitle = () => {
    if (conversationId === 'new') return 'Nova Conversa';
    
    const chat = chats.find(c => c._id === conversationId);
    return chat?.title || 'Conversa';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header Skeleton - Fixed */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-zeagro-green to-zeagro-green/90 text-white p-4 shadow-lg rounded-md">
          <div className="flex items-center gap-4">
             <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
             <div>
               <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
               <div className="h-4 bg-gray-300 rounded w-24 mt-1 animate-pulse"></div>
             </div>
          </div>
        </div>

        {/* Messages Area Skeleton - With padding for fixed header and input area */}
        <div className="flex-1 overflow-auto pt-20 pb-24 p-4 space-y-4">
           {[...Array(5)].map((_, i) => (
             <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
               <div className={`max-w-[80%] p-3 rounded-xl bg-gray-300 animate-pulse ${i % 2 === 0 ? 'rounded-bl-sm' : 'rounded-br-sm'}`}>
                 <div className="h-4 bg-gray-400 rounded w-full mb-1"></div>
                 <div className={`h-4 bg-gray-400 rounded ${i % 2 === 0 ? 'w-3/4' : 'w-2/3'}`}></div>
               </div>
             </div>
           ))}
        </div>

        {/* Input Area Skeleton - Fixed at bottom */}
         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
           <div className="flex gap-2">
             <div className="flex-1 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
             <div className="w-20 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
           </div>
         </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-zeagro-green to-zeagro-green/90 text-white p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/assistant')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">{getConversationTitle()}</h1>
            <p className="text-sm opacity-90">Assistente Virtual</p>
          </div>
        </div>
      </div>

      {/* Main Content - With padding for fixed header */}
      <div className="flex-1 overflow-auto pt-20 pb-24">
        <div className="p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.senderId !== 'BOT_ZÉ_AGRO' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`relative max-w-[80%] p-3 rounded-xl ${
                  message.senderId !== 'BOT_ZÉ_AGRO'
                    ? 'bg-zeagro-green text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow-md rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {formatMessageTime(message.timestamp)}
                </span>
                {/* Chat bubble tail - Rotated square technique */}
                <div
                  className={`absolute w-2.5 h-2.5 bottom-1 ${
                    message.senderId !== 'BOT_ZÉ_AGRO'
                      ? 'right-[-6px] bg-zeagro-green transform rotate-45'
                      : 'left-[-6px] bg-white transform rotate-45'
                  }`}
                />
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="relative max-w-[80%] p-3 rounded-xl bg-white text-gray-800 shadow-md rounded-tl-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-zeagro-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-zeagro-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-zeagro-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                {/* Typing indicator tail - Rotated square technique */}
                <div className="absolute w-2.5 h-2.5 bottom-1 left-[-6px] bg-white transform rotate-45" />
              </div>
            </div>
          )}
          {/* Scroll reference element - positioned at the very end */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zeagro-green"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-zeagro-green text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
