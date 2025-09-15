import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@stores/appStore';
import { parseRulesFromText, rulesToText, exportRulesToFile, importRulesFromFile } from '@utils/ruleUtils';
import { Download, Upload, ChevronUp, ChevronDown } from 'lucide-react';

const RuleEditor: React.FC = () => {
  const { rules, setRules } = useAppStore();
  const [ruleText, setRuleText] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 只在组件挂载时从状态管理中读取规则
    setRuleText(rulesToText(rules));
  }, []); // 空依赖数组，只在挂载时执行一次

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRuleText(text);

    // Parse and update rules in real-time
    const parsedRules = parseRulesFromText(text);
    setRules(parsedRules);
  };

  const handleExportRules = () => {
    exportRulesToFile(rules);
  };

  const handleImportRules = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const importedRules = await importRulesFromFile(file);
        setRules(importedRules);
        setRuleText(rulesToText(importedRules));
      } catch (error) {
        console.error('Failed to import rules:', error);
      }
    }
  };

  const handleResetToDefault = () => {
    const defaultRules = [
      { id: '1', keyword: '死', replacement: '💀' },
      { id: '2', keyword: '血', replacement: '🩸' },
      { id: '3', keyword: '杀', replacement: '🔪' },
      { id: '4', keyword: '暴', replacement: '👊' },
      { id: '5', keyword: '亡', replacement: '⚰️' }
    ];
    setRules(defaultRules);
    setRuleText(rulesToText(defaultRules));
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 移动端：折叠状态的标题行 */}
      <div className="lg:hidden flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">违禁词列表</h3>
          <button
            onClick={toggleCollapse}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors duration-200"
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* PC端：始终显示完整内容 */}
      <div className="hidden lg:flex lg:flex-col lg:h-full">
        {/* PC端标题行 */}
        <div className="flex-shrink-0">
          <h3 className="text-lg font-semibold">违禁词列表</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            格式：违禁词,替换词（每行一条）
          </p>
        </div>

        {/* PC端内容区域 */}
        <div className="flex-1 min-h-0 mt-4 flex flex-col">
          <textarea
            value={ruleText}
            onChange={handleTextChange}
            className="flex-1 min-h-0 textarea-field font-mono text-sm resize-none"
          />
          <div className="flex-shrink-0 mt-2 flex flex-col space-y-2">
            {/* 第一行：统计信息 */}
            <div className="flex justify-start">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                共 {rules.length} 条违禁词
              </span>
            </div>

            {/* 第二行：操作按钮 */}
            <div className="flex justify-start gap-3">
              <button
                onClick={handleExportRules}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors duration-200"
                title="导出规则"
              >
                <Download size={12} />
                导出
              </button>
              <button
                onClick={handleImportRules}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors duration-200"
                title="导入规则"
              >
                <Upload size={12} />
                导入
              </button>
              <button
                onClick={handleResetToDefault}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="重置规则"
              >
                重置
              </button>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={handleFileImport}
        className="hidden"
      />

      {/* 移动端：可折叠的内容区域 */}
      {!isCollapsed && (
        <div className="lg:hidden flex-1 flex flex-col min-h-0 mt-4">
          {/* 描述文字 */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            格式：违禁词,替换词（每行一条）
          </p>

          {/* 文本区域 */}
          <textarea
            value={ruleText}
            onChange={handleTextChange}
            className="flex-1 textarea-field font-mono text-sm resize-none min-h-[100px]"
          />

          {/* 底部工具栏 */}
          <div className="flex-shrink-0 mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              共 {rules.length} 条违禁词
            </span>
            <div className="flex gap-3">
              <button
                onClick={handleExportRules}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors duration-200"
                title="导出规则"
              >
                <Download size={12} />
                导出
              </button>
              <button
                onClick={handleImportRules}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors duration-200"
                title="导入规则"
              >
                <Upload size={12} />
                导入
              </button>
              {/* 移动端重置按钮 */}
              <button
                onClick={handleResetToDefault}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleEditor;