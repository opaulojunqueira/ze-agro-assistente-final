import React from 'react';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '../components/BottomNavigation';

const Diagnostic: React.FC = () => {
  const { toast } = useToast();

  const handleCapture = () => {
    toast({
      title: "Função em desenvolvimento",
      description: "A captura de imagem estará disponível em breve"
    });
  };

  const handleUpload = () => {
    toast({
      title: "Função em desenvolvimento",
      description: "O upload de imagem estará disponível em breve"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-zeagro-green to-zeagro-green/90 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Diagnóstico Visual</h1>
            <p className="text-sm opacity-90">Identifique problemas na sua plantação</p>
          </div>
        </div>
      </div>

      {/* Main Content - With padding for fixed header */}
      <div className="flex-1 overflow-auto pt-20 pb-20">
        {/* Intro Text */}
        <div className="p-4 text-center text-gray-700">
          {/* Removed: Tire uma foto ou faça upload de uma imagem da sua plantação para análise */}
        </div>

        <div className="p-4">
          <div className="mt-6 flex flex-col items-center">
            <div className="w-full max-w-md aspect-square bg-zeagro-gray rounded-lg flex flex-col items-center justify-center shadow-lg">
              <ImageIcon size={64} className="text-zeagro-gray-dark opacity-50" />
              <p className="mt-4 text-zeagro-gray-dark text-center px-6">
                Tire uma foto ou faça upload de uma imagem da sua plantação para análise
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
              <button 
                onClick={handleCapture} 
                className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-zeagro-gray-dark rounded-lg shadow-md hover:bg-zeagro-gray/20 transition-colors"
              >
                <Camera size={32} className="text-zeagro-green" />
                <span className="font-medium">Tirar Foto</span>
              </button>
              
              <button 
                onClick={handleUpload} 
                className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-zeagro-gray-dark rounded-lg shadow-md hover:bg-zeagro-gray/20 transition-colors"
              >
                <Upload size={32} className="text-zeagro-green" />
                <span className="font-medium">Upload</span>
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold">Diagnósticos Recentes</h2>
            
            <div className="mt-4 flex flex-col gap-4">
              <div className="p-4 bg-white rounded-lg shadow-md border-l-4 border-zeagro-green">
                <p className="font-medium">Nenhum diagnóstico recente</p>
                <p className="text-sm text-zeagro-gray-dark">Seus diagnósticos aparecerão aqui</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Diagnostic;
