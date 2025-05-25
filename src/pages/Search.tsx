
import React, { useState } from 'react';
import { Search as SearchIcon, History } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { useToast } from '@/hooks/use-toast';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const recentSearches = [
    "Peste na soja",
    "Previsão climática região sul",
    "Tratamento ferrugem"
  ];

  const popularTopics = [
    "Análise de solo",
    "Plantio direto",
    "Manejo integrado",
    "Pragas comuns",
    "Irrigação eficiente",
    "Fertilizantes orgânicos"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Pesquisando",
        description: `Buscando resultados para "${searchQuery}"`
      });
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-zeagro-green text-white p-4">
        <h1 className="text-xl font-bold text-center mb-3">Pesquisar</h1>
        
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O que você está procurando?"
              className="w-full py-2 px-4 pl-10 rounded-lg text-zeagro-gray-dark focus:outline-none focus:ring-2 focus:ring-zeagro-gold"
            />
            <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zeagro-gray-dark" />
          </div>
        </form>
      </div>

      <div className="p-4">
        {/* Recent Searches */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Pesquisas Recentes</h2>
            <button className="text-zeagro-green text-sm">Limpar</button>
          </div>
          
          <div className="mt-3">
            {recentSearches.map((search, index) => (
              <div key={index} className="flex items-center py-3 border-b border-zeagro-gray">
                <History size={16} className="text-zeagro-gray-dark mr-3" />
                <p>{search}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Popular Topics */}
        <div>
          <h2 className="text-lg font-bold mb-3">Tópicos Populares</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {popularTopics.map((topic, index) => (
              <div 
                key={index} 
                className="p-4 bg-white rounded-lg shadow-md border border-zeagro-gray hover:border-zeagro-green transition-colors cursor-pointer"
              >
                <p className="font-medium text-center">{topic}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Search;
