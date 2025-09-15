import type { Rule } from '../types';

export const parseRulesFromText = (text: string): Rule[] => {
  const lines = text.split('\n');
  const rules: Rule[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine && trimmedLine.includes(',')) {
      const [keyword, replacement] = trimmedLine.split(',').map(item => item.trim());
      if (keyword && replacement) {
        rules.push({
          id: Date.now().toString() + index,
          keyword,
          replacement,
        });
      }
    }
  });

  return rules;
};

export const rulesToText = (rules: Rule[]): string => {
  return rules.map(rule => `${rule.keyword},${rule.replacement}`).join('\n');
};

export const exportRulesToFile = (rules: Rule[]): void => {
  const text = rulesToText(rules);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `forbidden-rules-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importRulesFromFile = (file: File): Promise<Rule[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const rules = parseRulesFromText(content);
        resolve(rules);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};