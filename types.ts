
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Metadata {
  title: string;
  description: string;
  captureDate: string;
  coordinates: Coordinates | null;
}

export interface AIAnalysis {
  status: 'idle' | 'loading' | 'success' | 'error';
  result: string;
}

export interface UploadedImageFile {
  id: string;
  file: File;
  previewUrl: string;
  metadata: Metadata;
  aiAnalysis: AIAnalysis;
}
