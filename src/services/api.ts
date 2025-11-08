import axios from 'axios';

const API_URL = 'https://lumina-backend-v9pe.onrender.com';
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export interface TranscriptionResult {
  text: string;
  fileName: string;
  duration: string;
  fileSize: string;
  date: string;
}

export const transcribeFile = async (file: File): Promise<TranscriptionResult> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/api/transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Updated timeout and size for your new backend (100MB)
      timeout: 300000, // 5 minutes
      maxContentLength: 100 * 1024 * 1024, // 100MB (your new backend limit)
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 413) {
        throw new Error('File size exceeds 100MB limit');
      }
      throw new Error(error.response?.data?.detail || 'Error transcribing file');
    }
    throw error;
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
