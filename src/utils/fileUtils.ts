import type { Rule } from '../types';
import { parseRulesFromText } from './ruleUtils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface ProcessedFile {
  name: string;
  originalContent: string;
  processedContent: string;
  replaceCount: number;
  originalSize: number;
  processedSize: number;
  warnings?: string[];
}

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  else return (bytes / 1048576).toFixed(2) + ' MB';
};

export const importRulesFromFile = (file: File): Promise<Rule[]> => {
  return new Promise((resolve, reject) => {
    // 文件类型检查
    if (!file.type.includes('text') && !file.name.toLowerCase().endsWith('.txt')) {
      reject(new Error('请选择文本文件（.txt）'));
      return;
    }
    
    // 文件大小检查
    if (file.size > 10 * 1024 * 1024) { // 10MB限制
      reject(new Error('文件过大，请选择小于10MB的文件'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        // 解析规则
        const result = parseRulesFromText(content);
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败，请检查文件是否损坏'));
    reader.readAsText(file);
  });
};

export const processMultipleFiles = async (
  files: File[],
  rules: { keyword: string; replacement: string }[]
): Promise<ProcessedFile[]> => {
  const results: ProcessedFile[] = [];
  const errors: string[] = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      // 单个文件验证
      const file = files[i];
      if (!file.type.includes('text') && !file.name.toLowerCase().endsWith('.txt')) {
        errors.push(`${file.name}: 不是文本文件`);
        continue;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB单个文件限制
        errors.push(`${file.name}: 文件过大（超过5MB）`);
        continue;
      }
      
      const result = await processFile(file, rules);
      results.push(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '处理失败';
      errors.push(`${files[i]?.name || '未知文件'}: ${errorMessage}`);
    }
  }
  
  // 如果有错误但整体成功，在结果中添加警告
  if (errors.length > 0 && results.length > 0) {
    results[0].warnings = [...(results[0].warnings || []), ...errors.map(e => `跳过的文件: ${e}`)];
  }
  
  return results;
};

export const downloadProcessedFiles = async (files: ProcessedFile[]): Promise<void> => {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.name, file.processedContent);
  });

  try {
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'processed_documents.zip');
  } catch {
    throw new Error('Failed to generate ZIP file');
  }
};

export const processFile = async (
  file: File,
  rules: { keyword: string; replacement: string }[]
): Promise<ProcessedFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { processText } = require('./textUtils');
        const result = processText(content, rules.map((r, index) => ({
          id: index.toString(),
          keyword: r.keyword,
          replacement: r.replacement
        })));
        
        resolve({
          name: file.name,
          originalContent: content,
          processedContent: result.processedText,
          replaceCount: result.replaceCount,
          originalSize: content.length,
          processedSize: result.processedText.length,
          warnings: result.warnings?.map((w: any) => w.message)
        });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
};

export const downloadSingleFile = (file: ProcessedFile): void => {
  const blob = new Blob([file.processedContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};