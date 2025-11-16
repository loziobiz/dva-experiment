import React, { useEffect, useState } from 'react';
import { UploadedImageFile, Metadata } from '../types';
import MapPicker from './MapPicker';
import TrashIcon from './icons/TrashIcon';

interface MetadataPanelProps {
  selectedFiles: UploadedImageFile[];
  updateMetadata: (updatedMetadata: Partial<Metadata>) => void;
  onDelete: () => void;
  onSubmit: () => void;
  hasFiles: boolean;
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({ selectedFiles, updateMetadata, onDelete, onSubmit, hasFiles }) => {
  const [formData, setFormData] = useState<Partial<Metadata>>({});

  useEffect(() => {
    if (selectedFiles.length === 1) {
      setFormData(selectedFiles[0].metadata);
    } else {
      // For multi-select or no selection, reset form
      setFormData({
        title: '',
        description: '',
        captureDate: new Date().toISOString().split('T')[0],
        coordinates: null
      });
    }
  }, [selectedFiles]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    updateMetadata({ [name]: value });
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateMetadata({ [name]: value });
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const selectionCount = selectedFiles.length;

  if (!hasFiles) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200 h-full flex flex-col justify-center items-center text-center">
        <h3 className="text-xl font-semibold text-stone-700">Metadata Panel</h3>
        <p className="mt-2 text-sm text-stone-500">Upload images to begin adding details and contributing to archaeological discovery.</p>
      </div>
    );
  }

  if (selectionCount === 0) {
    return (
       <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
        <h3 className="text-xl font-semibold text-stone-700">Metadata Panel</h3>
        <p className="mt-2 text-sm text-stone-500">Select an image or multiple images to view and edit their details.</p>
         <div className="mt-6 border-t pt-6">
            <button
                onClick={onSubmit}
                className="w-full bg-amber-700 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
                Submit All Geotagged Images
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-stone-700">Edit Details</h3>
          <p className="text-sm text-stone-500">{selectionCount} image{selectionCount > 1 ? 's' : ''} selected</p>
        </div>
         <button
            onClick={onDelete}
            className="text-stone-500 hover:text-red-600 transition-colors p-1"
            title="Delete selected"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-stone-700">
            Title {selectionCount > 1 && <span className="text-xs text-stone-400">(apply to all)</span>}
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            placeholder={selectionCount > 1 ? "Bulk edit title..." : "e.g., Roman Villa Footprint"}
            className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-stone-700">
            Description {selectionCount > 1 && <span className="text-xs text-stone-400">(apply to all)</span>}
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            value={formData.description || ''}
            onChange={handleInputChange}
            placeholder={selectionCount > 1 ? "Bulk edit description..." : "Observations about the terrain, any visible patterns, etc."}
            className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="captureDate" className="block text-sm font-medium text-stone-700">
             Capture Date {selectionCount > 1 && <span className="text-xs text-stone-400">(apply to all)</span>}
          </label>
          <input
            type="date"
            name="captureDate"
            id="captureDate"
            value={formData.captureDate || ''}
            onChange={handleDateChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>
        
        {selectionCount === 1 && (
          <MapPicker coordinates={formData.coordinates || null} onCoordinatesChange={(coords) => updateMetadata({coordinates: coords})} />
        )}
        {selectionCount > 1 && (
            <div className="text-center p-4 bg-stone-100 rounded-md">
                <p className="text-sm text-stone-600">Geolocation can only be set for a single image at a time. Select one image to pin its location.</p>
            </div>
        )}

      </div>

       <div className="mt-6 border-t pt-6">
            <button
                onClick={onSubmit}
                className="w-full bg-amber-700 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
                Submit All Geotagged Images
            </button>
        </div>
    </div>
  );
};

export default MetadataPanel;