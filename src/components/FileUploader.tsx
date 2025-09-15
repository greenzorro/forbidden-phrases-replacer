import React, { useState, useRef } from 'react';
import { useAppStore } from '@stores/appStore';
import { processMultipleFiles, downloadProcessedFiles, downloadSingleFile } from '@utils/fileUtils';
import { File, X, FileText, Clock } from 'lucide-react';

const FileUploader: React.FC = () => {
  const { files, rules, setFiles, setProcessedFiles, clearProcessedFiles } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type === 'text/plain');
    if (droppedFiles.length > 0) {
      setFiles([...files, ...droppedFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(file => file.type === 'text/plain');
    if (selectedFiles.length > 0) {
      setFiles([...files, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const processAndDownloadFiles = async () => {
    if (files.length === 0 || rules.length === 0) return;

    setIsProcessing(true);
    clearProcessedFiles();

    try {
      const results = await processMultipleFiles(files, rules);
      setProcessedFiles(results);

      // 直接下载处理后的文件
      if (results.length === 1) {
        downloadSingleFile(results[0]);
      } else if (results.length > 1) {
        await downloadProcessedFiles(results);
      }
    } catch (error) {
      console.error('Failed to process and download files:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  return (
    <div className="h-full flex flex-col">
  
      <div className="flex-1 flex flex-col min-h-0">
        {/* 文件上传区域 */}
        <div
          className={`flex-1 border-2 rounded-lg p-4 transition-colors flex flex-col min-h-0 ${
            files.length > 0
              ? 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
              : dragActive
              ? 'border-primary bg-primary/10 border-dashed'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 border-dashed'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {/* 文件列表或上传提示 */}
          {files.length > 0 ? (
            <div className="flex-1 flex flex-col lg:flex-row lg:gap-4 lg:h-20 space-y-3 lg:space-y-0">
              {/* 文件列表 */}
              <div className="flex-1 min-h-0">
                <div className="h-36 lg:h-full overflow-y-auto space-y-1 lg:pr-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded flex-shrink-0">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <File size={16} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 按钮区域 */}
              <div className="flex flex-col gap-2 w-full lg:w-32 sm:w-40 flex-shrink-0">
                <button
                  onClick={processAndDownloadFiles}
                  disabled={isProcessing || rules.length === 0}
                  className={`btn-primary flex items-center justify-center gap-2 text-sm flex-1 ${isProcessing || rules.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? (
                    <>
                      <Clock size={16} className="animate-spin" />
                      处理并下载中...
                    </>
                  ) : (
                    <>
                      <FileText size={16} />
                      替换 {files.length} 个文件
                    </>
                  )}
                </button>
                <button
                  onClick={() => setFiles([])}
                  className="btn-secondary flex items-center justify-center text-sm flex-1"
                >
                  清空列表
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                拖拽TXT文件到此处或点击选择文件
              </p>
              <button
                onClick={openFileDialog}
                className="btn-secondary text-sm"
              >
                选择文件
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </div>

  
        {rules.length === 0 && files.length > 0 && (
          <div className="flex-shrink-0 text-center py-2 text-amber-600 dark:text-amber-400 text-xs">
            请先在左侧添加替换规则，然后点击"处理文件"按钮
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;