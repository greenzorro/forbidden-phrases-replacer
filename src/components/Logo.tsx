import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
        <img 
          src="/app-icon.png" 
          alt="违禁词替换工具" 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        违禁词替换工具
      </span>
    </div>
  );
};

export default Logo;