import React from 'react';
import { UploadedImageFile } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface AnalysisPanelProps {
  selectedFile: UploadedImageFile | null;
  onRequestAnalysis: (id: string) => Promise<void>;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ selectedFile, onRequestAnalysis }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
      <h3 className="text-xl font-semibold text-stone-700 mb-3">AI Archaeological Analysis</h3>
      
      {!selectedFile && (
        <p className="text-sm text-stone-500">Select a single image to run or view its AI analysis.</p>
      )}
      
      {selectedFile && (
        <>
          {selectedFile.aiAnalysis.status === 'idle' && (
            <button
              onClick={() => onRequestAnalysis(selectedFile.id)}
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Run Analysis</span>
            </button>
          )}
          {selectedFile.aiAnalysis.status === 'loading' && (
            <div className="w-full p-4 bg-stone-100 rounded-md flex items-center justify-center space-x-2 text-stone-600">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analysis in progress...</span>
            </div>
          )}
          {selectedFile.aiAnalysis.status === 'success' && (
            <div className="w-full p-3 bg-green-50 border border-green-200 rounded-md space-y-2">
              <p className="text-sm font-semibold text-green-800">Analysis Complete</p>
              <p className="text-sm text-stone-700 whitespace-pre-wrap">{selectedFile.aiAnalysis.result}</p>
            </div>
          )}
          {selectedFile.aiAnalysis.status === 'error' && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md space-y-2">
              <p className="text-sm font-semibold text-red-800">Analysis Failed</p>
              <p className="text-sm text-red-700 whitespace-pre-wrap">{selectedFile.aiAnalysis.result}</p>
              <button
                onClick={() => onRequestAnalysis(selectedFile.id)}
                className="text-sm font-semibold text-amber-700 hover:underline"
              >
                Try again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalysisPanel;
