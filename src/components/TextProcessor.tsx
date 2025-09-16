import React, { useState, useEffect } from 'react';
import { useAppStore } from '@stores/appStore';
import { processText } from '@utils/textUtils';
import { FileText, Copy, Check } from 'lucide-react';

// 示例内容常量 - 混合内容
const EXAMPLE_CONTENT = `这个文件包含了混合内容，既有违禁词也有正常内容。
在一些地方涉及警方和微信，但在其他地方都是正常描述。
例如：警方来了，但也有很多人没注意到。
微信消息令人关注，但生活还要继续。
禽兽被抓住了，社会恢复了和平。
小白脸的行为应该被制止，和平才是出路。
快手抖音很流行，但新的平台正在崛起。
炸弹威胁令人担心，但安全措施已经到位。
变态心理需要关注，健康才是重要的。
微博热搜不断变化，但话题热度不减。
这个文件测试混合内容的处理能力。`;

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

  const handleLoadExample = () => {
    setOriginalText(EXAMPLE_CONTENT);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* 原文输入 */}
        <div className="flex flex-col">
          <div className="flex-shrink-0 flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <FileText size={16} />
              原文内容
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLoadExample}
                className="text-xs text-primary hover:text-primary/80 transition-colors duration-200"
                title="加载示例内容"
              >
                示例效果
              </button>
              <button
                  onClick={handleClear}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  title="清空内容"
                >
                  清空
                </button>
            </div>
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
            <div className="flex items-center gap-3">
              {replaceCount > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  已替换 {replaceCount} 处
                </span>
              )}
              {processedText && (
                <button
                  onClick={handleCopyProcessed}
                  className={`flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors duration-200 ${
                    copied ? 'text-green-600 dark:text-green-400' : ''
                  }`}
                  title={copied ? '已复制' : '复制处理结果'}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? '已复制' : '复制'}
                </button>
              )}
            </div>
          </div>

          <textarea
            value={processedText}
            readOnly
            placeholder="处理结果将在此显示..."
            className="flex-1 textarea-field min-h-[120px] sm:min-h-0 resize-none bg-white dark:bg-[#242430]"
          />
          
          {/* Toast提示 - 修复位置跳跃问题 */}
          {copied && (
            <div className="fixed inset-x-0 top-4 flex justify-center z-50 animate-fade-in">
              <div className="bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✅</span>
                  <span className="text-sm font-medium">内容已复制到剪贴板</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      

      </div>
  );
};

export default TextProcessor;