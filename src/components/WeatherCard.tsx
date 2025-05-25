
import React from 'react';

interface WeatherCardProps {
  day: string;
  date: string;
  temp: { high: number; low: number };
  condition: string;
  bgImage?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ day, date, temp, condition, bgImage }) => {
  return (
    <div 
      className="min-w-28 h-32 rounded-lg overflow-hidden relative flex flex-col justify-between p-3 text-white mr-3 shadow-xl transition-transform hover:scale-[1.02]"
      style={{ 
        backgroundImage: bgImage ? `url(${bgImage})` : 'linear-gradient(to bottom, #106B36, #4C9A6D)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10">
        <p className="font-bold">{day}</p>
        <p className="text-xs opacity-90">{date}</p>
      </div>
      
      <div className="relative z-10">
        <p className="font-medium text-lg">{temp.high}° | {temp.low}°</p>
        <p className="text-xs opacity-90">{condition}</p>
      </div>
    </div>
  );
};

export default WeatherCard;
