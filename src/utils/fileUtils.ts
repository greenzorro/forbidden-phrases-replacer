import type { ProcessedFile } from '../types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  else return (bytes / 1048576).toFixed(2) + ' MB';
};

export const processFile = async (
  file: File,
  rules: { keyword: string; replacement: string }[]
): Promise<ProcessedFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const originalContent = e.target?.result as string;
        let processedContent = originalContent;
        let replaceCount = 0;

        // Execute replacements
        rules.forEach((rule) => {
          const regex = new RegExp(rule.keyword, 'g');
          const matches = processedContent.match(regex);
          if (matches) {
            replaceCount += matches.length;
            processedContent = processedContent.replace(regex, rule.replacement);
          }
        });

        const processedFile: ProcessedFile = {
          name: file.name,
          originalContent,
          processedContent,
          replaceCount,
          originalSize: originalContent.length,
          processedSize: processedContent.length,
        };

        resolve(processedFile);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const processMultipleFiles = async (
  files: File[],
  rules: { keyword: string; replacement: string }[]
): Promise<ProcessedFile[]> => {
  const promises = files.map(file => processFile(file, rules));
  return Promise.all(promises);
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