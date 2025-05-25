
import React from 'react';
import { Home, Camera, MessageCircle, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white py-2 px-6 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.1)] border-t border-zeagro-gray">
      <NavButton 
        icon={<Home size={22} />} 
        label="Início" 
        isActive={isActive('/home')}
        onClick={() => navigate('/home')}
      />
      
      <NavButton 
        icon={<Camera size={22} />} 
        label="Diagnosticar" 
        isActive={isActive('/diagnostic')}
        onClick={() => navigate('/diagnostic')}
      />
      
      <NavButton 
        icon={<MessageCircle size={22} />} 
        label="Assistente" 
        isActive={isActive('/assistant')}
        onClick={() => navigate('/assistant')}
      />
      
      <NavButton 
        icon={<User size={22} />} 
        label="Meu Perfil" 
        isActive={isActive('/profile')}
        onClick={() => navigate('/profile')}
      />
    </div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center transition-colors ${isActive ? 'text-zeagro-green' : 'text-zeagro-gray-dark'}`}
    >
      {icon}
      <span className={`text-xs mt-1 ${isActive ? 'font-medium' : ''}`}>{label}</span>
      {isActive && <div className="w-1.5 h-1.5 bg-zeagro-green rounded-full mt-1.5" />}
    </button>
  );
};

export default BottomNavigation;
