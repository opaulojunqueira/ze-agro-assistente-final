
import React from 'react';

interface ZeLogoProps {
  className?: string;
  withText?: boolean;
}

const ZeLogo: React.FC<ZeLogoProps> = ({ className = "", withText = true }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center">
        {/* The leaf logo in green circle */}
        <div className="bg-zeagro-green rounded-full w-14 h-14 flex items-center justify-center">
          <div className="text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 3V5C21 14.627 14.627 21 5 21H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12C12 16.4183 9.31371 20 6 20C2.68629 20 0 16.4183 0 12C0 7.58172 2.68629 4 6 4C9.31371 4 12 7.58172 12 12Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>

      {withText && (
        <div className="mt-2 text-center">
          <h2 className="text-zeagro-green text-2xl font-bold">Zé Agro</h2>
          <p className="text-zeagro-gold text-sm">Inteligência para o campo</p>
        </div>
      )}
    </div>
  );
};

export default ZeLogo;
