import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileAudio, 
  FileVideo, 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Download,
  X,
  RefreshCw
} from 'lucide-react';
import { transcribeFileWithRetry, TranscriptionResult } from '../services/api';
import { saveTranscription } from '../services/storage';

const Transcribe = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback((selectedFile: File) => {
    // Validate file type
    const validTypes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 
      'video/mp4', 'video/mpeg', 'video/quicktime'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please select a valid audio or video file (MP3, WAV, MP4)');
      return;
    }

    // Validate file size (100MB limit)
    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResult(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  }, [handleFileSelect]);

  const handleTranscribe = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const transcriptionResult = await transcribeFileWithRetry(
        file, 
        (progress) => setProgress(progress),
        3 // max retries
      );
      
      setProgress(100);
      setResult(transcriptionResult);
      
      // Save to history
      saveTranscription(transcriptionResult);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during transcription');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  const downloadTranscription = () => {
    if (!result) return;
    
    const element = document.createElement('a');
    const fileBlob = new Blob([result.text], { type: 'text/plain' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = `${result.fileName.split('.')[0]}-transcription.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Transcribe Your Media
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Transform your audio and video files into text with our AI-powered transcription service.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!file && !isProcessing && !result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800 rounded-xl shadow-xl p-8 mb-8"
            >
              <div
                onDrop={handleDrop}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                  dragActive 
                    ? 'border-purple-500 bg-purple-900/20' 
                    : 'border-gray-600 hover:border-purple-500'
                }`}
              >
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Upload Your File</h3>
                <p className="text-gray-400 mb-4">
                  Drag and drop your audio or video file here, or click to browse
                </p>
                <input
                  type="file"
                  accept="audio/*,video/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium cursor-pointer transition-colors"
                >
                  Choose File
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Supported: MP3, WAV, MP4 (Max: 100MB)
                </p>
              </div>
            </motion.div>
          )}

          {file && !isProcessing && !result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800 rounded-xl shadow-xl p-8 mb-8"
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {file.type.startsWith('audio/') ? (
                    <FileAudio className="h-16 w-16 text-blue-400" />
                  ) : (
                    <FileVideo className="h-16 w-16 text-green-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{file.name}</h3>
                <p className="text-gray-400 mb-6">
                  Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleTranscribe}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
                  >
                    Start Transcription
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800 rounded-xl shadow-xl p-8 mb-8"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-white mb-2">Processing Your File</h3>
                <p className="text-gray-400 mb-4">
                  Our AI is transcribing your media. This may take a few moments...
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <motion.div
                    className="bg-purple-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-gray-500">{progress}% complete</p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800 rounded-xl shadow-xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">Transcription Complete</h3>
                    <p className="text-gray-400">File: {result.fileName}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={downloadTranscription}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    New File
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 max-h-96 overflow-y-auto">
                <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                  {result.text}
                </pre>
              </div>

              <div className="mt-4 text-sm text-gray-400">
                <p>Duration: {result.duration} | File Size: {result.fileSize}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-400">{error}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Transcribe;