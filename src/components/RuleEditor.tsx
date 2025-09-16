import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@stores/appStore';
import { parseRulesFromText, rulesToText, exportRulesToFile, importRulesFromFile } from '@utils/ruleUtils';
import { validateRules } from '@utils/validationUtils';
import type { ValidationResult } from '@utils/validationUtils';
import { InlineAlert } from '@components/InlineAlert';
import { Download, Upload, ChevronUp, ChevronDown } from 'lucide-react';

const RuleEditor: React.FC = () => {
  const { rules, setRules } = useAppStore();
  const [ruleText, setRuleText] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 只在组件挂载时从状态管理中读取规则
    setRuleText(rulesToText(rules));
  }, []); // 空依赖数组，只在挂载时执行一次

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRuleText(text);

    // Parse and update rules in real-time with validation
    const parsedRules = parseRulesFromText(text);
    setRules(parsedRules);
    
    // 实时验证
    if (text.trim()) {
      const result = validateRules(parsedRules);
      setValidationResult(result);
      setShowValidation(true);
    } else {
      setShowValidation(false);
    }
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
        
        // 显示验证结果
        const validation = validateRules(importedRules);
        setValidationResult(validation);
        setShowValidation(true);
        
      } catch (error) {
        console.error('Failed to import rules:', error);
        // 可以在这里添加用户友好的错误提示
      }
    }
  };

  const handleResetToDefault = () => {
    const defaultRules = [
      { id: '1', keyword: '阎王', replacement: '👻' },
      { id: '2', keyword: '死', replacement: '💀' },
      { id: '3', keyword: '尸', replacement: '💀' },
      { id: '4', keyword: '杀', replacement: '🔪' },
      { id: '5', keyword: '血', replacement: '🩸' },
      { id: '6', keyword: '刺激', replacement: '刺❤️' },
      { id: '7', keyword: '包养', replacement: '包❤️' },
      { id: '8', keyword: '小白脸', replacement: '小😳' },
      { id: '9', keyword: '禽兽', replacement: '🐽' },
      { id: '10', keyword: '畜生', replacement: '🐽' },
      { id: '11', keyword: '杂种', replacement: '🐽' },
      { id: '12', keyword: '淫', replacement: '⭕️' },
      { id: '13', keyword: '春梦', replacement: '⭕️梦' },
      { id: '14', keyword: '春宫图', replacement: '❤️' },
      { id: '15', keyword: '色', replacement: '⭕️' },
      { id: '16', keyword: '湿', replacement: '💦' },
      { id: '17', keyword: '水', replacement: '💦' },
      { id: '18', keyword: '胴', replacement: '👙' },
      { id: '19', keyword: '浪荡', replacement: '🫦' },
      { id: '20', keyword: '荡妇', replacement: '💃' },
      { id: '21', keyword: '姬', replacement: '💃' },
      { id: '22', keyword: '妓', replacement: '💃' },
      { id: '23', keyword: '下流', replacement: '🤤' },
      { id: '24', keyword: '套套', replacement: '🌂' },
      { id: '25', keyword: '避孕套', replacement: '🌂' },
      { id: '26', keyword: '安全套', replacement: '🌂' },
      { id: '27', keyword: '黑丝', replacement: '🦵🏿' },
      { id: '28', keyword: '丝袜', replacement: '🦵🏿' },
      { id: '29', keyword: '黑', replacement: '⚫️' },
      { id: '30', keyword: '警方', replacement: '👮' },
      { id: '31', keyword: '警官', replacement: '👮' },
      { id: '32', keyword: '警察', replacement: '👮' },
      { id: '33', keyword: '警车', replacement: '🚓' },
      { id: '34', keyword: '风流', replacement: '🤤' },
      { id: '35', keyword: '放荡', replacement: '🫦' },
      { id: '36', keyword: '出轨', replacement: '🛌' },
      { id: '37', keyword: '性', replacement: '⚧️' },
      { id: '38', keyword: '床', replacement: '🛏️' },
      { id: '39', keyword: '奸', replacement: '👩‍❤️‍💋‍👨' },
      { id: '40', keyword: '下半身', replacement: '🩳' },
      { id: '41', keyword: '姦', replacement: '❤️' },
      { id: '42', keyword: '老子', replacement: '😠' },
      { id: '43', keyword: '挑逗', replacement: '🫦' },
      { id: '44', keyword: '小三', replacement: '💃' },
      { id: '45', keyword: '傻逼', replacement: '😠' },
      { id: '46', keyword: '卧槽', replacement: '😠' },
      { id: '47', keyword: '我草', replacement: '😠' },
      { id: '48', keyword: '贱', replacement: '😋' },
      { id: '49', keyword: '勾', replacement: '🪝' },
      { id: '50', keyword: '欲', replacement: '👄' },
      { id: '51', keyword: '吻', replacement: '👄' },
      { id: '52', keyword: '腿', replacement: '🦵' },
      { id: '53', keyword: '胸', replacement: '🐻' },
      { id: '54', keyword: '情', replacement: '💗' },
      { id: '55', keyword: '唇', replacement: '👄' },
      { id: '56', keyword: '睡', replacement: '💤' },
      { id: '57', keyword: '你妈的', replacement: '😠' },
      { id: '58', keyword: '激情', replacement: '❤️' },
      { id: '59', keyword: '暧昧', replacement: '🫦' },
      { id: '60', keyword: '情趣', replacement: '🫦' },
      { id: '61', keyword: '精', replacement: '❤️' },
      { id: '62', keyword: '疯狂', replacement: '❤️' },
      { id: '63', keyword: '他妈的', replacement: '😠' },
      { id: '64', keyword: '内内', replacement: '🩲' },
      { id: '65', keyword: '内裤', replacement: '🩲' },
      { id: '66', keyword: '下身', replacement: '❤️' },
      { id: '67', keyword: '裸', replacement: '❤️' },
      { id: '68', keyword: '爱', replacement: '❤️' },
      { id: '69', keyword: '坦诚相见', replacement: '👙' },
      { id: '70', keyword: '内衣', replacement: '👙' },
      { id: '71', keyword: '微信', replacement: '🛰️' },
      { id: '72', keyword: '快手', replacement: '📱' },
      { id: '73', keyword: '抖音', replacement: '📱' },
      { id: '74', keyword: '钱', replacement: '💴' },
      { id: '75', keyword: '狗', replacement: '🐕' },
      { id: '76', keyword: '维和', replacement: '维❤️' },
      { id: '77', keyword: '炸弹', replacement: '💣' },
      { id: '78', keyword: '爆炸', replacement: '💥' },
      { id: '79', keyword: '刀', replacement: '🔪' },
      { id: '80', keyword: '攻', replacement: '♂️' },
      { id: '81', keyword: '嫖', replacement: '🛌' },
      { id: '82', keyword: '娼', replacement: '💃' },
      { id: '83', keyword: '真他妈', replacement: '😠' },
      { id: '84', keyword: '央妈', replacement: '❤️' },
      { id: '85', keyword: '中央', replacement: '中❤️' },
      { id: '86', keyword: '禁', replacement: '🈲' },
      { id: '87', keyword: '咬', replacement: '👄' },
      { id: '88', keyword: '嘴', replacement: '👄' },
      { id: '89', keyword: '药', replacement: '💊' },
      { id: '90', keyword: '酒', replacement: '🍺' },
      { id: '91', keyword: '脱', replacement: '❤️' },
      { id: '92', keyword: '压', replacement: '❤️' },
      { id: '93', keyword: '游走', replacement: '❤️' },
      { id: '94', keyword: '抚摸', replacement: '🤚' },
      { id: '95', keyword: '牛逼', replacement: '🐂' },
      { id: '96', keyword: '毒', replacement: '🦠' },
      { id: '97', keyword: '赌', replacement: '🎲' },
      { id: '98', keyword: '草', replacement: '🌿' },
      { id: '99', keyword: '骚', replacement: '🫦' },
      { id: '100', keyword: '皮肉', replacement: '❤️' },
      { id: '101', keyword: '彩票', replacement: '🎟️' },
      { id: '102', keyword: '会所', replacement: '🏩' },
      { id: '103', keyword: '挑逗', replacement: '😘' },
      { id: '104', keyword: '狗曰', replacement: '🐕️🌄' },
      { id: '105', keyword: '婊', replacement: '⌚️' },
      { id: '106', keyword: '翻云覆雨', replacement: '深入交流' },
      { id: '107', keyword: '水乳交融', replacement: '深入交流' },
      { id: '108', keyword: '打扑克', replacement: '打🎴' },
      { id: '109', keyword: '小红书', replacement: '🍠' },
      { id: '110', keyword: '腰子', replacement: '🫃' },
      { id: '111', keyword: '肾', replacement: '🫃' },
      { id: '112', keyword: '变态', replacement: '😋' },
      { id: '113', keyword: '枪', replacement: '🔫' },
      { id: '114', keyword: '子弹', replacement: '🔫' },
      { id: '115', keyword: '微博', replacement: '🧣' }
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
          
          {/* 实时验证提示 - 非侵入式 */}
          {showValidation && validationResult && (
            <div className="mt-2 space-y-1">
              {validationResult.errors.slice(0, 3).map((error, index) => (
                <InlineAlert
                  key={`error-${index}`}
                  type="error"
                  message={error.message}
                  autoClose={5000}
                />
              ))}
              {validationResult.warnings.slice(0, 2).map((warning, index) => (
                <InlineAlert
                  key={`warning-${index}`}
                  type="warning"
                  message={warning.message}
                  autoClose={4000}
                />
              ))}
              {validationResult.errors.length > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  还有 {validationResult.errors.length - 3} 个错误...
                </div>
              )}
            </div>
          )}
          
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
          
          {/* 实时验证提示 - 非侵入式 */}
          {showValidation && validationResult && (
            <div className="mt-2 space-y-1">
              {validationResult.errors.slice(0, 3).map((error, index) => (
                <InlineAlert
                  key={`error-${index}`}
                  type="error"
                  message={error.message}
                  autoClose={5000}
                />
              ))}
              {validationResult.warnings.slice(0, 2).map((warning, index) => (
                <InlineAlert
                  key={`warning-${index}`}
                  type="warning"
                  message={warning.message}
                  autoClose={4000}
                />
              ))}
              {validationResult.errors.length > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  还有 {validationResult.errors.length - 3} 个错误...
                </div>
              )}
            </div>
          )}

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