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

// Enhanced health check with better error handling
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    console.log('🔍 Checking API health at:', `${API_URL}/api/health`);
    
    const response = await axios.get(`${API_URL}/api/health`, {
      timeout: 5000, // 5 second timeout
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log('✅ Health check response:', response.data);
    
    // Check if the response has the expected structure
    if (response.data && response.data.status === 'healthy') {
      return true;
    }
    
    console.log('❌ Health check failed - unexpected response structure:', response.data);
    return false;
    
  } catch (error) {
    console.error('❌ Health check error:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url
      });
    }
    
    return false;
  }
};

// Alternative health check with more details
export const getApiHealthDetails = async (): Promise<{
  healthy: boolean;
  message?: string;
  error?: string;
}> => {
  try {
    const response = await axios.get(`${API_URL}/api/health`, {
      timeout: 5000
    });
    
    return {
      healthy: response.data.status === 'healthy',
      message: response.data.message || 'API is healthy',
      error: undefined
    };
    
  } catch (error) {
    return {
      healthy: false,
      message: 'API is offline',
      error: axios.isAxiosError(error) ? error.message : 'Unknown error'
    };
  }
};

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
      timeout: 300000,
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
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Max retries exceeded');
};