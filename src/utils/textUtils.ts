import type { Rule, Diff } from '../types';
import { validateTextContent, escapeKeyword } from './validationUtils';
import type { ValidationWarning } from './validationUtils';

export const processText = (text: string, rules: Rule[]): { 
  processedText: string; 
  replaceCount: number;
  warnings?: ValidationWarning[];
  performance?: {
    processingTime: number;
    ruleCount: number;
  };
} => {
  const startTime = performance.now();
  let processedText = text;
  let replaceCount = 0;
  
  // 内容验证
  const contentWarnings = validateTextContent(text);
  
  // 性能优化：大量规则时分批处理
  if (rules.length > 100) {
    return processLargeTextBatch(text, rules, startTime, contentWarnings);
  }
  
  // 普通处理
  rules.forEach((rule) => {
    try {
      // 安全转义特殊字符
      const safeKeyword = escapeKeyword(rule.keyword);
      const regex = new RegExp(safeKeyword, 'g');
      const matches = processedText.match(regex);
      if (matches) {
        replaceCount += matches.length;
        processedText = processedText.replace(regex, rule.replacement);
      }
    } catch (error) {
      console.warn(`处理规则失败: ${rule.keyword} -> ${rule.replacement}`, error);
    }
  });
  
  const endTime = performance.now();
  
  return { 
    processedText, 
    replaceCount,
    warnings: contentWarnings,
    performance: {
      processingTime: endTime - startTime,
      ruleCount: rules.length
    }
  };
};

/**
 * 批量处理大文本，优化性能
 */
const processLargeTextBatch = (
  text: string, 
  rules: Rule[], 
  startTime: number,
  contentWarnings: ValidationWarning[]
): { 
  processedText: string; 
  replaceCount: number;
  warnings?: ValidationWarning[];
  performance?: {
    processingTime: number;
    ruleCount: number;
  };
} => {
  let processedText = text;
  let replaceCount = 0;
  const batchSize = 50;
  
  // 分批处理规则
  for (let i = 0; i < rules.length; i += batchSize) {
    const batch = rules.slice(i, i + batchSize);
    
    batch.forEach((rule) => {
      try {
        const safeKeyword = escapeKeyword(rule.keyword);
        const regex = new RegExp(safeKeyword, 'g');
        const matches = processedText.match(regex);
        if (matches) {
          replaceCount += matches.length;
          processedText = processedText.replace(regex, rule.replacement);
        }
      } catch (error) {
        console.warn(`处理规则失败: ${rule.keyword} -> ${rule.replacement}`, error);
      }
    });
    
    // 避免长时间阻塞，让出控制权
    if (i % 200 === 0) {
      // 可以在这里添加进度回调
    }
  }
  
  const endTime = performance.now();
  
  return { 
    processedText, 
    replaceCount,
    warnings: [...contentWarnings, {
      type: 'performance',
      message: '文本较长，已使用分批处理优化性能',
      suggestion: '建议分批处理超大文本'
    }],
    performance: {
      processingTime: endTime - startTime,
      ruleCount: rules.length
    }
  };
};

export const getDiff = (original: string, processed: string): Diff[] => {
  try {
    const diffs: Diff[] = [];
    let i = 0;
    let j = 0;

    while (i < original.length && j < processed.length) {
      if (original[i] === processed[j]) {
        // Find the longest common substring
        let commonLength = 0;
        while (i + commonLength < original.length &&
               j + commonLength < processed.length &&
               original[i + commonLength] === processed[j + commonLength]) {
          commonLength++;
        }

        if (commonLength > 0) {
          diffs.push({
            type: 'unchanged',
            text: original.substring(i, i + commonLength)
          });
          i += commonLength;
          j += commonLength;
        }
      } else {
        // Find deleted text
        let deleteLength = 0;
        while (i + deleteLength < original.length &&
               (j + deleteLength >= processed.length || original[i + deleteLength] !== processed[j + deleteLength])) {
          deleteLength++;
        }

        if (deleteLength > 0) {
          diffs.push({
            type: 'removed',
            text: original.substring(i, i + deleteLength)
          });
          i += deleteLength;
        }

        // Find added text
        let addLength = 0;
        while (j + addLength < processed.length &&
               (i + addLength >= original.length || original[i + addLength] !== processed[j + addLength])) {
          addLength++;
        }

        if (addLength > 0) {
          diffs.push({
            type: 'added',
            text: processed.substring(j, j + addLength)
          });
          j += addLength;
        }
      }
    }

    // Add remaining text
    if (i < original.length) {
      diffs.push({
        type: 'removed',
        text: original.substring(i)
      });
    }

    if (j < processed.length) {
      diffs.push({
        type: 'added',
        text: processed.substring(j)
      });
    }

    return diffs;
  } catch (error) {
    console.error('Diff计算失败:', error);
    return [{
      type: 'unchanged',
      text: processed || original
    }];
  }
};

export const getDiffClasses = (diff: Diff): string => {
  switch (diff.type) {
    case 'added':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'removed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 line-through';
    default:
      return '';
  }
};