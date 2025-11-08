import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Trash2, Search, Clock, FileAudio, FileVideo } from 'lucide-react';
import { TranscriptionHistory, getTranscriptions, deleteTranscription, searchTranscriptions } from '../services/storage';

const History = () => {
  const [transcriptions, setTranscriptions] = useState<TranscriptionHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTranscription, setSelectedTranscription] = useState<TranscriptionHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTranscriptions();
  }, []);

  const loadTranscriptions = () => {
    setIsLoading(false);
    setTranscriptions(getTranscriptions());
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this transcription?')) {
      deleteTranscription(id);
      loadTranscriptions();
      if (selectedTranscription?.id === id) {
        setSelectedTranscription(null);
      }
    }
  };

  const downloadTranscription = (transcription: TranscriptionHistory) => {
    const element = document.createElement('a');
    const fileBlob = new Blob([transcription.text], { type: 'text/plain' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = `${transcription.fileName.split('.')[0]}-transcription.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredTranscriptions = searchTerm 
    ? searchTranscriptions(searchTerm)
    : transcriptions;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading transcriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Your Transcription History
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Access and manage all your previous transcriptions
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Search transcriptions by filename or content..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-4 bg-gray-700">
                <h2 className="text-lg font-semibold text-white">Recent Transcriptions</h2>
                <p className="text-sm text-gray-400 mt-1">{transcriptions.length} total</p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {filteredTranscriptions.length > 0 ? (
                    filteredTranscriptions.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 cursor-pointer transition-colors border-l-4 ${
                          selectedTranscription?.id === item.id
                            ? 'bg-purple-900/30 border-purple-500'
                            : 'border-transparent hover:bg-gray-700/50'
                        }`}
                        onClick={() => setSelectedTranscription(item)}
                      >
                        <div className="flex items-start">
                          {item.fileName.endsWith('.mp3') || item.fileName.endsWith('.wav') ? (
                            <FileAudio className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                          ) : (
                            <FileVideo className="h-5 w-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {item.fileName}
                            </p>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{item.duration}</span>
                              <span className="mx-1">•</span>
                              <span>{item.fileSize}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(item.date)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-8 text-center"
                    >
                      <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-400 mb-2">
                        {searchTerm ? 'No Results Found' : 'No Transcriptions Yet'}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {searchTerm 
                          ? 'Try adjusting your search terms' 
                          : 'Start transcribing files to see them here'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedTranscription ? (
                <motion.div
                  key={selectedTranscription.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-gray-800 rounded-xl shadow-lg h-full"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        {selectedTranscription.fileName.endsWith('.mp3') || 
                         selectedTranscription.fileName.endsWith('.wav') ? (
                          <FileAudio className="h-8 w-8 text-blue-400 mr-3" />
                        ) : (
                          <FileVideo className="h-8 w-8 text-green-400 mr-3" />
                        )}
                        <div>
                          <h2 className="text-xl font-semibold text-white">
                            {selectedTranscription.fileName}
                          </h2>
                          <div className="flex items-center text-sm text-gray-400 mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{selectedTranscription.duration}</span>
                            <span className="mx-2">•</span>
                            <span>{selectedTranscription.fileSize}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(selectedTranscription.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => downloadTranscription(selectedTranscription)}
                          className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                          title="Download transcription"
                        >
                          <Download className="h-5 w-5 text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(selectedTranscription.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          title="Delete transcription"
                        >
                          <Trash2 className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 bg-gray-900 rounded-lg p-6 overflow-y-auto">
                      <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                        {selectedTranscription.text}
                      </pre>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => downloadTranscription(selectedTranscription)}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Text
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gray-800 rounded-xl shadow-lg h-full flex items-center justify-center p-8"
                >
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-400 mb-2">No Transcription Selected</h3>
                    <p className="text-gray-500">
                      Select a transcription from the list to view its details
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;