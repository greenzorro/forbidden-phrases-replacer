import React, { useState } from 'react';
import { useAppStore } from '@stores/appStore';
import { downloadProcessedFiles, downloadSingleFile } from '@utils/fileUtils';

const DownloadManager: React.FC = () => {
  const { processedFiles } = useAppStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (processedFiles.length === 0) return;

    setIsDownloading(true);
    try {
      if (processedFiles.length === 1) {
        // 单个文件直接下载TXT
        const file = processedFiles[0];
        downloadSingleFile(file);
      } else {
        // 多个文件打包下载ZIP
        await downloadProcessedFiles(processedFiles);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getDownloadButtonText = () => {
    if (processedFiles.length === 0) return '暂无文件';
    if (processedFiles.length === 1) return '下载处理后的文件';
    return `下载 ${processedFiles.length} 个文件`;
  };

  const getDownloadDescription = () => {
    if (processedFiles.length === 0) return '请先上传并处理文件';
    if (processedFiles.length === 1) return '处理完成';
    return `处理完成`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0">
        {/* 下载区域 */}
        <div className="flex-1 border-2 border-dashed rounded-lg p-6 text-center transition-colors flex flex-col items-center justify-center min-h-0 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {getDownloadDescription()}
          </p>
          <button
            onClick={handleDownload}
            disabled={isDownloading || processedFiles.length === 0}
            className={`btn-primary text-sm ${isDownloading || processedFiles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isDownloading ? '处理中...' : getDownloadButtonText()}
          </button>
        </div>

        </div>
    </div>
  );
};

export default DownloadManager;