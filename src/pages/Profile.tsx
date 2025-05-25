import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, User, Map, Bell, HelpCircle, Lock, FileText } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { useProperties } from '../hooks/useProperties';
import BottomNavigation from '../components/BottomNavigation';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, logout } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { properties, loading: propertiesLoading } = useProperties();

  const handleMenuItemClick = (action: string, route?: string) => {
    if (route) {
      navigate(route);
    } else {
      toast({
        title: "Função em desenvolvimento",
        description: `A função "${action}" estará disponível em breve`
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout",
        variant: "destructive",
      });
    }
  };

  if (profileLoading || propertiesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Header/Profile Info Skeleton */}
        <div className="bg-zeagro-green text-white p-6 pb-12 mb-6 rounded-xl shadow-lg">
           <div className="flex flex-col items-center">
             <div className="w-20 h-20 rounded-full bg-gray-300 mb-2 animate-pulse"></div>
             <div className="h-6 bg-gray-300 rounded w-40 mb-1 animate-pulse"></div>
             <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
           </div>
        </div>

        {/* Profile Stats Skeleton */}
        <div className="mx-4 -mt-12 bg-white rounded-xl shadow-xl p-4 mb-6">
           <div className="grid grid-cols-3 gap-4 text-center py-3">
             {[...Array(3)].map((_, i) => (
               <div key={i}>
                 <div className="h-5 bg-gray-300 rounded w-12 mx-auto mb-1 animate-pulse"></div>
                 <div className="h-3 bg-gray-300 rounded w-16 mx-auto animate-pulse"></div>
               </div>
             ))}
           </div>
        </div>

        {/* Menu Items Skeleton */}
        <div className="px-4 mt-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
             {[...Array(7)].map((_, i) => (
               <div key={i} className="flex items-center px-4 py-3 border-b border-gray-200 last:border-0">
                 <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 animate-pulse"></div>
                 <div className="flex-1 h-5 bg-gray-300 rounded mr-3 animate-pulse"></div>
                 <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
               </div>
             ))}
          </div>
           <div className="mt-6 w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-300 text-gray-300 animate-pulse">
              <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
             <div className="h-5 bg-gray-300 rounded w-20 animate-pulse"></div>
           </div>
        </div>

        {/* Bottom Navigation Placeholder */}
         <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-300 animate-pulse"></div>

      </div>
    );
  }

  const userName = profile?.name || currentUser?.displayName || 'Usuário';
  const userEmail = profile?.email || currentUser?.email || '';
  const propertiesCount = properties?.length || 0;
  const totalHectares = properties.reduce((sum, property) => sum + property.sizeHa, 0);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-zeagro-green text-white p-6 pb-12">
        <h1 className="text-xl font-bold text-center mb-6">Meu Perfil</h1>
        
        <div className="flex flex-col items-center">
          <Avatar className="w-20 h-20 border-2 border-white mb-2">
            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60" alt="User profile" />
          </Avatar>
          <h2 className="font-bold text-lg">{userName}</h2>
          <p className="text-sm opacity-80">{userEmail}</p>
        </div>
      </div>

      {/* Profile info card */}
      <div className="mx-4 -mt-6 bg-white rounded-xl shadow-xl p-4">
        <div className="grid grid-cols-3 gap-4 text-center py-3">
          <div>
            <p className="font-bold text-lg">{totalHectares.toFixed(1)}</p>
            <p className="text-xs text-zeagro-gray-dark">Hectares</p>
          </div>
          <div className="border-x border-zeagro-gray">
            <p className="font-bold text-lg">{propertiesCount}</p>
            <p className="text-xs text-zeagro-gray-dark">Propriedades</p>
          </div>
          <div>
            <p className="font-bold text-lg">8</p>
            <p className="text-xs text-zeagro-gray-dark">Diagnósticos</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <MenuItem 
            icon={<User size={18} />} 
            title="Dados Pessoais" 
            onClick={() => handleMenuItemClick("Dados Pessoais", "/profile/personal-data")} 
          />
          <MenuItem 
            icon={<Map size={18} />} 
            title="Minhas Propriedades" 
            onClick={() => handleMenuItemClick("Minhas Propriedades", "/profile/properties")} 
          />
          <MenuItem 
            icon={<Bell size={18} />} 
            title="Notificações" 
            onClick={() => handleMenuItemClick("Notificações")} 
          />
          <MenuItem 
            icon={<FileText size={18} />} 
            title="Relatórios" 
            onClick={() => handleMenuItemClick("Relatórios")} 
          />
          <MenuItem 
            icon={<Lock size={18} />} 
            title="Privacidade e Segurança" 
            onClick={() => handleMenuItemClick("Privacidade e Segurança")} 
          />
          <MenuItem 
            icon={<HelpCircle size={18} />} 
            title="Ajuda e Suporte" 
            onClick={() => handleMenuItemClick("Ajuda e Suporte")} 
          />
          <MenuItem 
            icon={<Settings size={18} />} 
            title="Configurações" 
            onClick={() => handleMenuItemClick("Configurações")} 
          />
        </div>
        
        <button 
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

// Menu Item Component
interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center px-4 py-3 hover:bg-zeagro-gray/20 transition-colors border-b border-zeagro-gray last:border-0"
    >
      <div className="w-8 h-8 rounded-full bg-zeagro-green/10 flex items-center justify-center text-zeagro-green mr-3">
        {icon}
      </div>
      <span className="flex-1 text-left">{title}</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  );
};

export default Profile;
