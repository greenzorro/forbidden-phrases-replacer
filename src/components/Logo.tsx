import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">禁</span>
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        违禁词替换工具
      </span>
    </div>
  );
};

export default Logo;