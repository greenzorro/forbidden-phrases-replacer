import React, { useEffect } from 'react';
import { useAppStore } from '@stores/appStore';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useAppStore();

  useEffect(() => {
    // Initialize theme on component mount - 确保主题正确应用
    const applyTheme = (currentTheme: 'light' | 'dark') => {
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // 立即应用当前主题
    applyTheme(theme);
    
    // 监听系统主题变化（可选功能）
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // 只有当用户没有手动设置主题时才跟随系统
      const storedTheme = localStorage.getItem('forbidden-phrases-storage');
      if (storedTheme) {
        try {
          const parsed = JSON.parse(storedTheme);
          if (parsed.state?.theme) {
            // 用户已设置主题，不跟随系统
            return;
          }
        } catch (error) {
          console.error('Failed to parse stored theme:', error);
        }
      }
      
      // 如果没有存储的主题设置，跟随系统
      const systemTheme = e.matches ? 'dark' : 'light';
      if (systemTheme !== theme) {
        toggleTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme, toggleTheme]);

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
      aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-gray-600" />
      ) : (
        <Sun size={20} className="text-gray-300" />
      )}
    </button>
  );
};

export default ThemeToggle;