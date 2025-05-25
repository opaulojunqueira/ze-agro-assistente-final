import React from 'react';
import ZeAssistantIcon from '../components/ZeAssistantIcon';
import { Bell, Search, Eye, CloudRain, Package, FileText, MessageSquare, DollarSign, Book, Grid2x2 } from 'lucide-react';
import CategoryButton from '../components/CategoryButton';
import WeatherCard from '../components/WeatherCard';
import DiagnosticCard from '../components/DiagnosticCard';
import BottomNavigation from '../components/BottomNavigation';
import { useToast } from '@/hooks/use-toast';
import { Avatar } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { useProperties } from '../hooks/useProperties';

const Home: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useUserProfile();
  const { properties, loading: propertiesLoading } = useProperties();
  
  // Mock data para categorias (mantém o mesmo)
  const categories = [
    { 
      id: 1, 
      title: "Diagnóstico Visual", 
      icon: <Eye size={24} />
    },
    { 
      id: 2, 
      title: "Previsão Climática", 
      icon: <CloudRain size={24} />
    },
    { 
      id: 3, 
      title: "Manejo Inteligente", 
      icon: <Package size={24} />
    },
    { 
      id: 4, 
      title: "Histórico da Lavoura", 
      icon: <FileText size={24} />
    },
    { 
      id: 5, 
      title: "Assistente Virtual", 
      icon: <MessageSquare size={24} />
    },
    { 
      id: 6, 
      title: "Gestão de Custo", 
      icon: <DollarSign size={24} />
    },
    { 
      id: 7, 
      title: "Diário de Campo", 
      icon: <Book size={24} />
    },
    { 
      id: 8, 
      title: "Ver Mais", 
      icon: <Grid2x2 size={24} />
    }
  ];
  
  // Mock data para clima (temporário até implementar weather API)
  const weatherData = [
    {
      day: "Hoje",
      date: "27/04/25",
      temp: { high: 25, low: 13 },
      condition: "Chuva | Vento",
      bgImage: "https://images.unsplash.com/photo-1438449805896-28a666819a20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJhaW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      day: "Amanhã",
      date: "28/04/25",
      temp: { high: 30, low: 18 },
      condition: "Nublado",
      bgImage: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNsb3VkeXxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=500&q=60"
    },
    {
      day: "Próx. dias",
      date: "29/04/25",
      temp: { high: 32, low: 18 },
      condition: "Ensolarado",
      bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmllbGR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
    }
  ];
  
  // Mock data para diagnósticos (temporário)
  const diagnosticData = [
    {
      image: "https://images.unsplash.com/photo-1551650975-187a87371efb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGxhbnQlMjBkaXNlYXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      title: "Diagnóstico 1",
      date: "26/04/25"
    },
    {
      image: "https://images.unsplash.com/photo-1624768997502-fb15887900c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWdyaWN1bHR1cmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      title: "Diagnóstico 2",
      date: "25/04/25"
    }
  ];
  
  const handleCategoryClick = (id: number) => {
    if (id === 5) {
      navigate('/assistant');
    } else {
      toast({
        title: "Função em desenvolvimento",
        description: `Você clicou na categoria ${id}`
      });
    }
  };

  // Calcular total de hectares das propriedades
  const totalHectares = properties.reduce((sum, property) => sum + property.sizeHa, 0);
  
  // Nome do usuário
  const userName = profile?.name || 'Usuário';
  
  if (profileLoading || propertiesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
            <div>
              <div className="h-5 bg-gray-300 rounded w-40 mb-1 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          <div className="w-11 h-11 rounded-full bg-gray-300 animate-pulse"></div>
        </div>

        {/* Categories Skeleton */}
        <div className="mb-6">
           <div className="h-6 bg-gray-300 rounded w-32 mb-6 animate-pulse"></div>
           <div className="grid grid-cols-4 gap-y-6">
             {[...Array(8)].map((_, i) => (
               <div key={i} className="flex flex-col items-center">
                 <div className="w-10 h-10 bg-gray-300 rounded-full mb-2 animate-pulse"></div>
                 <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
               </div>
             ))}
           </div>
        </div>

        {/* Weather Section Skeleton */}
        <div className="mb-6">
           <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
           <div className="flex overflow-x-auto pb-2 hide-scrollbar">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="w-40 h-32 mr-4 bg-gray-300 rounded-xl animate-pulse"></div>
             ))}
           </div>
        </div>

        {/* Last Diagnostics Skeleton */}
         <div className="mb-6">
           <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
           <div className="flex overflow-x-auto pb-2 hide-scrollbar">
             {[...Array(2)].map((_, i) => (
               <div key={i} className="w-40 h-32 mr-4 bg-gray-300 rounded-xl animate-pulse"></div>
             ))}
           </div>
        </div>

        {/* Bottom Navigation Placeholder */}
         <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-300 animate-pulse"></div>

      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-zeagro-green to-zeagro-green/90 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-white shadow-md">
              <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=500&q=60" alt="User profile" />
            </Avatar>
            <div>
              <p className="font-bold text-lg">Bem vindo</p>
              <p className="text-sm opacity-90">{userName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative bg-white/10 backdrop-blur-sm rounded-full w-11 h-11 flex items-center justify-center hover:bg-white/20 transition-all duration-200 shadow-md">
              <Bell size={22} className="text-white" />
              <span className="absolute -top-1 -right-1 bg-zeagro-gold text-zeagro-green text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-sm">2</span>
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        {/* <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl flex items-center px-4 py-3 shadow-md">
          <input 
            type="text" 
            placeholder="Procurar..." 
            className="bg-transparent outline-none flex-1 text-white placeholder-white/70"
          />
          <Search size={18} className="text-white/70 ml-2" />
        </div> */}
      </div>
      
      {/* Categories */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Categorias</h2>
          <button className="text-zeagro-green hover:text-zeagro-green/80 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-y-6">
          {categories.map(category => (
            <CategoryButton 
              key={category.id}
              icon={category.icon}
              title={category.title}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Weather Section */}
      <div className="px-4 py-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Previsão Climática</h2>
          <button className="text-zeagro-green hover:text-zeagro-green/80 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="flex overflow-x-auto pb-2 hide-scrollbar">
          {weatherData.map((weather, index) => (
            <WeatherCard
              key={index}
              day={weather.day}
              date={weather.date}
              temp={weather.temp}
              condition={weather.condition}
              bgImage={weather.bgImage}
            />
          ))}
        </div>
      </div>
      
      {/* Last Diagnostics */}
      <div className="px-4 py-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Últimos Diagnósticos</h2>
        </div>
        
        <div className="flex overflow-x-auto pb-2 hide-scrollbar">
          {diagnosticData.map((diagnostic, index) => (
            <DiagnosticCard
              key={index}
              image={diagnostic.image}
              title={diagnostic.title}
              date={diagnostic.date}
            />
          ))}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
      
      <style>
        {`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default Home;
