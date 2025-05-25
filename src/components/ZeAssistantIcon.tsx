
import React from 'react';

const ZeAssistantIcon: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-zeagro-green">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="#87CEEB" />
          <rect y="60" width="100" height="40" fill="#106B36" />
          
          {/* Hat */}
          <path d="M30 40 L70 40 L75 50 L25 50 Z" fill="#E1C94C" />
          <path d="M35 30 L65 30 L70 40 L30 40 Z" fill="#E1C94C" />
          <path d="M40 25 L60 25 L65 30 L35 30 Z" fill="#E1C94C" />
          <path d="M30 40 L70 40 L70 45 L30 45 Z" fill="#333" />
          
          {/* Face */}
          <circle cx="50" cy="60" r="15" fill="#FFD7B5" />
          <path d="M45 55 Q50 60 55 55" fill="none" stroke="#333" strokeWidth="1.5" />
          <circle cx="45" cy="52" r="2" fill="#333" />
          <circle cx="55" cy="52" r="2" fill="#333" />
          <path d="M50 65 Q45 67 50 69 Q55 67 50 65" fill="#FF9999" />
          
          {/* Headset */}
          <path d="M35 52 Q35 45 42 45 L45 45" fill="none" stroke="#333" strokeWidth="2" />
          <rect x="33" y="52" width="4" height="8" fill="#333" rx="1" />
          
          {/* Pitchfork */}
          <path d="M30 75 L35 55 L40 75" fill="none" stroke="#6B4226" strokeWidth="3" />
          <path d="M35 55 L35 85" stroke="#6B4226" strokeWidth="3" />
        </svg>
      </div>
    </div>
  );
};

export default ZeAssistantIcon;
