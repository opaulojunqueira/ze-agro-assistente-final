
import React, { ReactNode } from 'react';

interface CategoryButtonProps {
  icon: ReactNode;
  title: string;
  onClick?: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ icon, title, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <div className="w-16 h-16 bg-zeagro-green rounded-full flex items-center justify-center text-white shadow-lg shadow-zeagro-green/30">
        {icon}
      </div>
      <p className="text-center text-xs font-medium mt-1.5">{title}</p>
    </div>
  );
};

export default CategoryButton;
