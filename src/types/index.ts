export interface Rule {
  id: string;
  keyword: string;
  replacement: string;
}

export interface ProcessedFile {
  name: string;
  originalContent: string;
  processedContent: string;
  replaceCount: number;
  originalSize: number;
  processedSize: number;
}

export interface AppState {
  rules: Rule[];
  files: File[];
  processedFiles: ProcessedFile[];
  originalText: string;
  processedText: string;
  theme: 'light' | 'dark';
}

export interface Diff {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}