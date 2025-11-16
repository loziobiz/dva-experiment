
import React, { useState, useCallback } from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  onFilesUpload: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = [...e.dataTransfer.files].filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      onFilesUpload(files);
    }
  }, [onFilesUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? [...e.target.files].filter(file => file.type.startsWith('image/')) : [];
    if (files.length > 0) {
      onFilesUpload(files);
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full min-h-[40vh] p-8 border-2 border-dashed rounded-lg transition-colors duration-200 ${isDragging ? 'border-amber-600 bg-amber-50' : 'border-stone-300 bg-white hover:border-amber-500'}`}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="file-upload"
      />
      <div className="text-center pointer-events-none">
        <UploadIcon className="mx-auto h-12 w-12 text-stone-400" />
        <p className="mt-4 text-lg font-semibold text-stone-700">Drag & drop your drone photos here</p>
        <p className="mt-1 text-sm text-stone-500">or click to browse your files</p>
        <p className="mt-2 text-xs text-stone-400">Supports multiple images (JPG, PNG, WEBP, etc.)</p>
      </div>
    </div>
  );
};

export default ImageUploader;
