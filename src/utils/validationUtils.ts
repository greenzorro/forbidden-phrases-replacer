import type { Rule } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  type: 'format' | 'empty' | 'duplicate' | 'circular';
  line?: number;
  message: string;
  suggestion?: string;
}

export interface ValidationWarning {
  type: 'performance' | 'duplicate' | 'similar' | 'large_file';
  line?: number;
  message: string;
  suggestion?: string;
}

/**
 * 验证规则格式
 */
export const validateRuleFormat = (line: string, lineNumber: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  const trimmedLine = line.trim();
  
  if (!trimmedLine) return errors;
  
  // 检查是否包含逗号
  if (!trimmedLine.includes(',')) {
    errors.push({
      type: 'format',
      line: lineNumber,
      message: `第${lineNumber}行格式错误：缺少逗号分隔符`,
      suggestion: '格式应为：违禁词,替换词'
    });
    return errors;
  }
  
  const parts = trimmedLine.split(',').map(part => part.trim());
  
  if (parts.length !== 2) {
    errors.push({
      type: 'format',
      line: lineNumber,
      message: `第${lineNumber}行格式错误：应该只有一个逗号分隔符`,
      suggestion: '格式应为：违禁词,替换词'
    });
    return errors;
  }
  
  const [keyword, replacement] = parts;
  
  // 检查空关键词
  if (!keyword) {
    errors.push({
      type: 'empty',
      line: lineNumber,
      message: `第${lineNumber}行关键词为空`,
      suggestion: '请提供需要替换的违禁词'
    });
  }
  
  // 检查空替换词
  if (!replacement) {
    errors.push({
      type: 'empty',
      line: lineNumber,
      message: `第${lineNumber}行替换词为空`,
      suggestion: '请提供替换后的内容'
    });
  }
  
  return errors;
};

/**
 * 验证规则列表
 */
export const validateRules = (rules: Rule[]): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const suggestions: string[] = [];
  
  const keywordMap = new Map<string, number[]>();
  
  rules.forEach((rule, index) => {
    // 基本格式验证
    const lineErrors = validateRuleFormat(`${rule.keyword},${rule.replacement}`, index + 1);
    errors.push(...lineErrors);
    
    // 检查重复关键词
    if (keywordMap.has(rule.keyword)) {
      const existingLines = keywordMap.get(rule.keyword)!;
      existingLines.push(index + 1);
      keywordMap.set(rule.keyword, existingLines);
    } else {
      keywordMap.set(rule.keyword, [index + 1]);
    }
    
    // 检查简单循环替换（只检测直接的A→B且B→A）
    rules.forEach((otherRule, otherIndex) => {
      if (index !== otherIndex && rule.keyword === otherRule.replacement && rule.replacement === otherRule.keyword) {
        errors.push({
          type: 'circular',
          line: index + 1,
          message: `第${index + 1}行与第${otherIndex + 1}行存在循环替换`,
          suggestion: '避免A→B且B→A的循环定义'
        });
      }
    });
  });
  
  // 检查重复关键词警告
  keywordMap.forEach((lines, keyword) => {
    if (lines.length > 1) {
      warnings.push({
        type: 'duplicate',
        line: lines[0],
        message: `关键词"${keyword}"在第${lines.join(', ')}行重复出现`,
        suggestion: '重复关键词将使用最后一条规则'
      });
    }
  });
  
  // 性能警告（放宽阈值到5000条）
  if (rules.length > 5000) {
    warnings.push({
      type: 'performance',
      message: `规则数量很多（${rules.length}条），可能影响处理性能`,
      suggestion: '建议分批处理超大规则集'
    });
  }
  
  // 空列表建议
  if (rules.length === 0) {
    suggestions.push('当前没有替换规则，建议添加一些常用规则');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
};

/**
 * 验证文本内容
 */
export const validateTextContent = (text: string): ValidationWarning[] => {
  const warnings: ValidationWarning[] = [];
  
  if (text.length > 10000) {
    warnings.push({
      type: 'large_file',
      message: `文本内容较长（${text.length}字符），可能影响处理速度`,
      suggestion: '建议分批处理长文本'
    });
  }
  
  return warnings;
};

/**
 * 安全转义关键词
 */
export const escapeKeyword = (keyword: string): string => {
  return keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * 检测循环依赖
 */
export const detectCircularDependencies = (rules: Rule[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  const graph = new Map<string, string[]>();
  
  // 构建依赖图
  rules.forEach(rule => {
    if (!graph.has(rule.keyword)) {
      graph.set(rule.keyword, []);
    }
    graph.get(rule.keyword)!.push(rule.replacement);
  });
  
  // 检测循环
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  const hasCycle = (node: string): boolean => {
    if (recursionStack.has(node)) return true;
    if (visited.has(node)) return false;
    
    visited.add(node);
    recursionStack.add(node);
    
    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor)) return true;
    }
    
    recursionStack.delete(node);
    return false;
  };
  
  // 检查每个节点
  for (const [keyword] of graph) {
    if (hasCycle(keyword)) {
      errors.push({
        type: 'circular',
        message: `检测到循环替换依赖：${keyword}`,
        suggestion: '请检查规则定义，避免循环替换'
      });
      break; // 只需要报告一次循环
    }
  }
  
  return errors;
};

/**
 * 规则优化建议
 */
export const getOptimizationSuggestions = (rules: Rule[]): string[] => {
  const suggestions: string[] = [];
  
  // 性能优化建议
  if (rules.length > 500) {
    suggestions.push('规则数量较多，建议按使用频率排序以提高性能');
  }
  
  // 通用建议
  if (rules.length > 0) {
    suggestions.push('建议定期备份规则，避免数据丢失');
    suggestions.push('可以按平台或场景分类管理规则');
  }
  
  return suggestions;
};