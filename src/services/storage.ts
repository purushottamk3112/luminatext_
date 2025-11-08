import { TranscriptionResult } from './api';

export interface TranscriptionHistory extends TranscriptionResult {
  id: number;
  date: string;
}

const STORAGE_KEY = 'transcriptions';
const MAX_HISTORY = 50;

export const saveTranscription = (transcription: TranscriptionResult): void => {
  try {
    const history = getTranscriptions();
    const newEntry: TranscriptionHistory = {
      ...transcription,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    
    // Add to beginning and limit size
    const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save transcription:', error);
  }
};

export const getTranscriptions = (): TranscriptionHistory[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load transcriptions:', error);
    return [];
  }
};

export const deleteTranscription = (id: number): void => {
  try {
    const history = getTranscriptions();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to delete transcription:', error);
  }
};

export const searchTranscriptions = (query: string): TranscriptionHistory[] => {
  const history = getTranscriptions();
  const lowercaseQuery = query.toLowerCase();
  
  return history.filter(item => 
    item.fileName.toLowerCase().includes(lowercaseQuery) ||
    item.text.toLowerCase().includes(lowercaseQuery)
  );
};

// Cleanup old transcriptions (keep last 30 days)
export const cleanupOldTranscriptions = (): void => {
  try {
    const history = getTranscriptions();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const filteredHistory = history.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= thirtyDaysAgo;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Failed to cleanup transcriptions:', error);
  }
};

// Export transcriptions as JSON
export const exportTranscriptions = (): void => {
  const history = getTranscriptions();
  const dataStr = JSON.stringify(history, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `transcriptions-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};