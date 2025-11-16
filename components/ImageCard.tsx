import React from 'react';
import { UploadedImageFile } from '../types';
import MapPinIcon from './icons/MapPinIcon';
import SparklesIcon from './icons/SparklesIcon';

interface ImageCardProps {
  file: UploadedImageFile;
  isSelected: boolean;
  onSelectionChange: (id: string, multiSelect: boolean) => void;
  onRequestAnalysis: (id: string) => Promise<void>;
}

const ImageCard: React.FC<ImageCardProps> = ({ file, isSelected, onSelectionChange, onRequestAnalysis }) => {
  const handleAnalyzeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRequestAnalysis(file.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    onSelectionChange(file.id, e.metaKey || e.ctrlKey);
  };

  const aiStatus = file.aiAnalysis.status;
  const hasCoordinates = !!file.metadata.coordinates;

  return (
    <div
      onClick={handleClick}
      className={`group relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${isSelected ? 'border-amber-600 shadow-xl' : 'border-transparent hover:shadow-md'}`}
    >
      <img src={file.previewUrl} alt={file.file.name} className="w-full h-48 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      
      {isSelected && <div className="absolute inset-0 ring-4 ring-amber-500 ring-inset rounded-lg pointer-events-none" />}

      <div className="absolute top-2 right-2 flex items-center space-x-2">
        {hasCoordinates && (
          <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full text-green-300" title="Geolocated">
            <MapPinIcon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <h4 className="font-bold text-sm truncate">{file.metadata.title || file.file.name}</h4>
        <div className="mt-2">
          {aiStatus === 'idle' && (
            <button
              onClick={handleAnalyzeClick}
              className="w-full text-xs bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-1.5 px-2 rounded-md transition-colors flex items-center justify-center space-x-1"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>Analyze with AI</span>
            </button>
          )}
          {aiStatus === 'loading' && (
             <div className="w-full text-xs bg-amber-500/80 text-white font-semibold py-1.5 px-2 rounded-md flex items-center justify-center space-x-1">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
             </div>
          )}
          {aiStatus === 'success' && (
            <div className="w-full text-xs bg-green-600/90 text-white font-semibold py-1.5 px-2 rounded-md flex items-center justify-center space-x-1.5 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Analysis Complete</span>
            </div>
          )}
          {aiStatus === 'error' && (
            <div className="w-full text-xs bg-red-600/90 text-white font-semibold py-1.5 px-2 rounded-md flex items-center justify-center space-x-1">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
               </svg>
              <button onClick={handleAnalyzeClick} className="underline font-bold">Retry Analysis</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
