import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface InlineAlertProps {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  onClose?: () => void;
  autoClose?: number; // 自动关闭时间（毫秒）
  className?: string;
}

/**
 * 内联提示组件 - 非侵入式设计
 * 显示在现有界面元素旁边，不占据额外空间
 */
export const InlineAlert: React.FC<InlineAlertProps> = ({
  type,
  message,
  onClose,
  autoClose,
  className = ''
}) => {
  const [isVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  const handleClose = () => {
    if (onClose) {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 200);
    }
  };

  if (!isVisible || !message) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertTriangle size={14} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={14} className="text-yellow-500" />;
      case 'info':
        return <Info size={14} className="text-blue-500" />;
      case 'success':
        return <CheckCircle size={14} className="text-green-500" />;
      default:
        return <Info size={14} className="text-gray-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div 
      className={`
        inline-flex items-center gap-2 px-2 py-1 rounded-md border text-xs
        ${getColors()} ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} 
        transition-all duration-200 ${className}
      `}
    >
      {getIcon()}
      <span className="flex-1 min-w-0">{message}</span>
      {onClose && (
        <button
          onClick={handleClose}
          className="ml-1 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          title="关闭"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};

/**
 * 浮动提示组件 - 显示在元素上方或下方
 */
interface FloatingAlertProps {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  targetRef: React.RefObject<HTMLElement>;
  onClose?: () => void;
}

export const FloatingAlert: React.FC<FloatingAlertProps> = ({
  type,
  message,
  position = 'bottom',
  targetRef,
  onClose
}) => {
  const [positionStyles, setPositionStyles] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const styles: React.CSSProperties = {
        position: 'absolute',
        zIndex: 50,
      };

      switch (position) {
        case 'bottom':
          styles.top = rect.bottom + 4;
          styles.left = rect.left;
          break;
        case 'top':
          styles.bottom = window.innerHeight - rect.top + 4;
          styles.left = rect.left;
          break;
        case 'left':
          styles.right = window.innerWidth - rect.left + 4;
          styles.top = rect.top;
          break;
        case 'right':
          styles.left = rect.right + 4;
          styles.top = rect.top;
          break;
      }

      setPositionStyles(styles);
    }
  }, [targetRef, position]);

  if (!message) return null;

  return (
    <div 
      className="fixed" 
      style={positionStyles}
    >
      <InlineAlert
        type={type}
        message={message}
        onClose={onClose}
        autoClose={3000}
      />
    </div>
  );
};

/**
 * 输入框内联验证提示
 */
interface InputValidationProps {
  errors?: string[];
  warnings?: string[];
  lineNumber?: number;
}

export const InputValidation: React.FC<InputValidationProps> = ({
  errors = [],
  warnings = [],
  lineNumber
}) => {
  if (errors.length === 0 && warnings.length === 0) return null;

  return (
    <div className="space-y-1">
      {errors.map((error, index) => (
        <InlineAlert
          key={`error-${index}`}
          type="error"
          message={lineNumber ? `第${lineNumber}行: ${error}` : error}
          autoClose={5000}
        />
      ))}
      {warnings.map((warning, index) => (
        <InlineAlert
          key={`warning-${index}`}
          type="warning"
          message={lineNumber ? `第${lineNumber}行: ${warning}` : warning}
          autoClose={4000}
        />
      ))}
    </div>
  );
};