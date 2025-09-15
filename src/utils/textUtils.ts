import type { Rule, Diff } from '../types';

export const processText = (text: string, rules: Rule[]): { processedText: string; replaceCount: number } => {
  let processedText = text;
  let replaceCount = 0;

  rules.forEach((rule) => {
    const regex = new RegExp(rule.keyword, 'g');
    const matches = processedText.match(regex);
    if (matches) {
      replaceCount += matches.length;
      processedText = processedText.replace(regex, rule.replacement);
    }
  });

  return { processedText, replaceCount };
};

export const getDiff = (original: string, processed: string): Diff[] => {
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