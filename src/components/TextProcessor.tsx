import React, { useState, useEffect } from 'react';
import { useAppStore } from '@stores/appStore';
import { processText } from '@utils/textUtils';
import { FileText, Copy, Check } from 'lucide-react';

const TextProcessor: React.FC = () => {
  const { rules, originalText, processedText, setOriginalText, setProcessedText } = useAppStore();
  const [replaceCount, setReplaceCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (originalText && rules.length > 0) {
      const { processedText: result, replaceCount: count } = processText(originalText, rules);
      setProcessedText(result);
      setReplaceCount(count);
    } else {
      setProcessedText(originalText);
      setReplaceCount(0);
    }
  }, [originalText, rules, setProcessedText]);

  const handleCopyProcessed = async () => {
    try {
      await navigator.clipboard.writeText(processedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleClear = () => {
    setOriginalText('');
    setProcessedText('');
    setReplaceCount(0);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            {replaceCount > 0 && (
              <span className="text-primary font-medium">
                已替换 {replaceCount} 处
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* 原文输入 */}
        <div className="flex flex-col">
          <div className="flex-shrink-0 flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <FileText size={16} />
              原文内容
            </label>
            <button
              onClick={handleClear}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
            >
              清空
            </button>
          </div>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="在此输入需要处理的文本内容..."
            className="flex-1 textarea-field min-h-[120px] sm:min-h-0 resize-none bg-white dark:bg-[#242430]"
          />
        </div>

        {/* 处理结果 */}
        <div className="flex flex-col">
          <div className="flex-shrink-0 flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <FileText size={16} />
              处理结果
            </label>
            {processedText && (
              <button
                onClick={handleCopyProcessed}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? '已复制' : '复制'}
              </button>
            )}
          </div>

          <textarea
            value={processedText}
            readOnly
            placeholder="处理结果将在此显示..."
            className="flex-1 textarea-field min-h-[120px] sm:min-h-0 resize-none bg-white dark:bg-[#242430]"
          />
        </div>
      </div>

      

      </div>
  );
};

export default TextProcessor;