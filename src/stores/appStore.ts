import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Rule, ProcessedFile } from '../types';

interface AppStore {
  // State
  rules: Rule[];
  files: File[];
  processedFiles: ProcessedFile[];
  originalText: string;
  processedText: string;
  theme: 'light' | 'dark';

  // Actions
  // Rules
  addRule: (rule: Omit<Rule, 'id'>) => void;
  updateRule: (id: string, updates: Partial<Rule>) => void;
  deleteRule: (id: string) => void;
  setRules: (rules: Rule[]) => void;
  moveRule: (fromIndex: number, toIndex: number) => void;
  clearRules: () => void;

  // Files
  setFiles: (files: File[]) => void;
  addFile: (file: File) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;

  // Processed files
  setProcessedFiles: (files: ProcessedFile[]) => void;
  addProcessedFile: (file: ProcessedFile) => void;
  clearProcessedFiles: () => void;

  // Text
  setOriginalText: (text: string) => void;
  setProcessedText: (text: string) => void;

  // Theme
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Initial state
      rules: [
        { id: '1', keyword: '死', replacement: '💀' },
        { id: '2', keyword: '血', replacement: '🩸' },
        { id: '3', keyword: '杀', replacement: '🔪' },
        { id: '4', keyword: '暴', replacement: '👊' },
        { id: '5', keyword: '亡', replacement: '⚰️' }
      ],
      files: [],
      processedFiles: [],
      originalText: '',
      processedText: '',
      theme: 'light',

      // Actions
      addRule: (rule) => {
        const newRule = { ...rule, id: Date.now().toString() };
        set((state) => ({
          rules: [...state.rules, newRule],
        }));
      },

      updateRule: (id, updates) => {
        set((state) => ({
          rules: state.rules.map((rule) =>
            rule.id === id ? { ...rule, ...updates } : rule
          ),
        }));
      },

      deleteRule: (id) => {
        set((state) => ({
          rules: state.rules.filter((rule) => rule.id !== id),
        }));
      },

      setRules: (rules) => {
        set({ rules });
      },

      moveRule: (fromIndex, toIndex) => {
        set((state) => {
          const newRules = [...state.rules];
          const [removed] = newRules.splice(fromIndex, 1);
          newRules.splice(toIndex, 0, removed);
          return { rules: newRules };
        });
      },

      clearRules: () => {
        set({ rules: [] });
      },

      setFiles: (files) => {
        set({ files });
      },

      addFile: (file) => {
        set((state) => ({
          files: [...state.files, file],
        }));
      },

      removeFile: (index) => {
        set((state) => ({
          files: state.files.filter((_, i) => i !== index),
        }));
      },

      clearFiles: () => {
        set({ files: [] });
      },

      setProcessedFiles: (files) => {
        set({ processedFiles: files });
      },

      addProcessedFile: (file) => {
        set((state) => ({
          processedFiles: [...state.processedFiles, file],
        }));
      },

      clearProcessedFiles: () => {
        set({ processedFiles: [] });
      },

      setOriginalText: (text) => {
        set({ originalText: text });
      },

      setProcessedText: (text) => {
        set({ processedText: text });
      },

      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          // Apply theme to document
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: newTheme };
        });
      },

      setTheme: (theme) => {
        set(() => {
          // Apply theme to document
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme };
        });
      },
    }),
    {
      name: 'forbidden-phrases-storage',
      partialize: (state) => ({
        rules: state.rules,
        theme: state.theme,
      }),
    }
  )
);