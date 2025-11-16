import React, { useState, useCallback, useEffect } from 'react';
import { UploadedImageFile, Metadata } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImageGrid from './components/ImageGrid';
import MetadataPanel from './components/MetadataPanel';
import AnalysisPanel from './components/AnalysisPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { analyzeImageWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [files, setFiles] = useLocalStorage<UploadedImageFile[]>('dva-files', []);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  const handleFilesUpload = (uploadedFiles: File[]) => {
    const newImageFiles: UploadedImageFile[] = uploadedFiles.map(file => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      metadata: {
        title: '',
        description: '',
        captureDate: new Date().toISOString().split('T')[0],
        coordinates: null
      },
      aiAnalysis: {
        status: 'idle',
        result: ''
      }
    }));
    setFiles(prevFiles => [...prevFiles, ...newImageFiles]);
  };

  const handleSelectionChange = (id: string, multiSelect: boolean) => {
    setSelectedFileIds(prev => {
      if (!multiSelect) {
        return prev.includes(id) && prev.length === 1 ? [] : [id];
      }
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return Array.from(newSelection);
    });
  };

  const updateMetadata = useCallback((updatedMetadata: Partial<Metadata>) => {
    setFiles(currentFiles => 
      currentFiles.map(file => {
        if (selectedFileIds.includes(file.id)) {
          return {
            ...file,
            metadata: {
              ...file.metadata,
              ...updatedMetadata
            }
          };
        }
        return file;
      })
    );
  }, [selectedFileIds, setFiles]);

  const updateAiAnalysis = useCallback((id: string, status: 'loading' | 'success' | 'error', result?: string) => {
    setFiles(currentFiles =>
      currentFiles.map(file =>
        file.id === id
          ? { ...file, aiAnalysis: { status, result: result ?? file.aiAnalysis.result } }
          : file
      )
    );
  }, [setFiles]);

  const requestAnalysis = useCallback(async (id: string) => {
    const fileToAnalyze = files.find(f => f.id === id);
    if (!fileToAnalyze) return;

    updateAiAnalysis(id, 'loading');
    try {
        const result = await analyzeImageWithGemini(fileToAnalyze.file);
        updateAiAnalysis(id, 'success', result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        updateAiAnalysis(id, 'error', `Analysis failed: ${errorMessage}`);
    } finally {
        // Automatically select the analyzed image
        setSelectedFileIds([id]);
    }
  }, [files, updateAiAnalysis, setSelectedFileIds]);

  const handleDeleteSelected = () => {
    setFiles(currentFiles => currentFiles.filter(file => !selectedFileIds.includes(file.id)));
    setSelectedFileIds([]);
  };

  const handleSubmitAll = () => {
    const filesToSubmit = files.filter(f => f.metadata.coordinates);
    if (filesToSubmit.length === 0) {
      alert("Please ensure at least one image has geolocation data before submitting.");
      return;
    }
    if (filesToSubmit.length < files.length) {
       if(!confirm("Some images don't have geolocation and will be excluded. Continue?")) {
           return;
       }
    }
    
    console.log('Submitting data to backend:', filesToSubmit);
    alert(`Successfully submitted ${filesToSubmit.length} images for archaeological review!`);
    
    // Clear submitted files
    setFiles(currentFiles => currentFiles.filter(file => !filesToSubmit.find(f => f.id === file.id)));
    setSelectedFileIds([]);
  };
  
  // Deselect files if they are deleted from another tab/window
  useEffect(() => {
    setSelectedFileIds(prev => prev.filter(id => files.some(f => f.id === id)));
  }, [files]);
  
  const selectedFiles = files.filter(f => selectedFileIds.includes(f.id));
  const singleSelectedFile = selectedFiles.length === 1 ? selectedFiles[0] : null;

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-stone-700 mb-4">Image Contribution Portal</h2>
            {files.length === 0 ? (
              <ImageUploader onFilesUpload={handleFilesUpload} />
            ) : (
              <ImageGrid 
                files={files} 
                selectedFileIds={selectedFileIds} 
                onSelectionChange={handleSelectionChange} 
                onFilesUpload={handleFilesUpload}
                onRequestAnalysis={requestAnalysis}
              />
            )}
          </div>

          {files.length > 0 && (
            <AnalysisPanel
              selectedFile={singleSelectedFile}
              onRequestAnalysis={requestAnalysis}
            />
          )}

          <aside className="w-full">
             <MetadataPanel 
                selectedFiles={selectedFiles} 
                updateMetadata={updateMetadata}
                onDelete={handleDeleteSelected}
                onSubmit={handleSubmitAll}
                hasFiles={files.length > 0}
              />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default App;