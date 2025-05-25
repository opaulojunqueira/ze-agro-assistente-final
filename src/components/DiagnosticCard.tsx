
import React from 'react';

interface DiagnosticCardProps {
  image: string;
  title?: string;
  date?: string;
}

const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ image, title, date }) => {
  return (
    <div className="w-40 h-24 rounded-lg overflow-hidden relative mr-3 shadow-md">
      <img src={image} alt={title || "Diagnóstico"} className="w-full h-full object-cover" />
      
      {(title || date) && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-2">
            {title && <p className="text-white text-xs font-medium">{title}</p>}
            {date && <p className="text-white text-xs opacity-80">{date}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default DiagnosticCard;
