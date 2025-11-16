import React from 'react';
import { UploadedImageFile } from '../types';
import ImageCard from './ImageCard';
import UploadIcon from './icons/UploadIcon';

interface ImageGridProps {
  files: UploadedImageFile[];
  selectedFileIds: string[];
  onSelectionChange: (id: string, multiSelect: boolean) => void;
  onFilesUpload: (files: File[]) => void;
  onRequestAnalysis: (id: string) => Promise<void>;
}

const ImageGrid: React.FC<ImageGridProps> = ({ files, selectedFileIds, onSelectionChange, onFilesUpload, onRequestAnalysis }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files ? [...e.target.files].filter(file => file.type.startsWith('image/')) : [];
    if (uploadedFiles.length > 0) {
      onFilesUpload(uploadedFiles);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-stone-200">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.map(file => (
                <ImageCard 
                key={file.id} 
                file={file} 
                isSelected={selectedFileIds.includes(file.id)}
                onSelectionChange={onSelectionChange}
                onRequestAnalysis={onRequestAnalysis}
                />
            ))}
             <label htmlFor="add-more-files" className="flex flex-col items-center justify-center w-full h-48 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 border-stone-300 bg-stone-50 hover:border-amber-500 hover:bg-amber-50">
                <UploadIcon className="h-8 w-8 text-stone-400" />
                <span className="mt-2 text-sm font-semibold text-center text-stone-600">Add more images</span>
                <input
                    id="add-more-files"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </label>
        </div>
    </div>
  );
};

export default ImageGrid;
