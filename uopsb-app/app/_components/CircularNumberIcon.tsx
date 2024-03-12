import React from 'react';

interface CircularNumberIconProps {
  number: number;
}

const CircularNumberIcon: React.FC<CircularNumberIconProps> = ({ number }) => {
  return (
    <div className="absolute inline-block m-2">
      <div
        className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/4 w-6 h-6 rounded-full flex items-center justify-center text-white bg-orange-500"
      >
        <span className="text-xs font-bold">{number}</span>
      </div>
      <span className="text-2xl">&nbsp;</span>
    </div>
  );
};

export default CircularNumberIcon;