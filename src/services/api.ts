import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://lumina-backend-v9pe.onrender.com';
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export interface TranscriptionResult {
  text: string;
  fileName: string;
  duration: string;
  fileSize: string;
  date: string;
}

export const transcribeFile = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<TranscriptionResult> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/api/transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes
      maxContentLength: MAX_FILE_SIZE,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 413:
          throw new Error('File size exceeds 100MB limit');
        case 429:
          throw new Error('Rate limit exceeded. Please try again later');
        case 503:
          throw new Error('Service temporarily unavailable. Please try again');
        case 504:
          throw new Error('Request timeout. Please try with a smaller file');
        default:
          throw new Error(error.response?.data?.detail || 'Error transcribing file');
      }
    }
    throw new Error('Network error. Please check your connection');
  }
};

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/api/health`);
    return response.data.status === 'healthy';
  } catch (error) {
    return false;
  }
};

// Retry logic for failed requests
export const transcribeFileWithRetry = async (
  file: File, 
  onProgress?: (progress: number) => void,
  maxRetries = 3
): Promise<TranscriptionResult> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await transcribeFile(file, onProgress);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Max retries exceeded');
};