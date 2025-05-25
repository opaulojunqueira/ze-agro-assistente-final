
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ZeLogo from '../components/ZeLogo';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="animate-pulse-slow">
        <ZeLogo className="scale-150" />
      </div>
      
      <div className="mt-8">
        <div className="w-16 h-1.5 bg-zeagro-gray rounded-full overflow-hidden">
          <div className="h-full bg-zeagro-green animate-pulse w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
