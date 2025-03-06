import React from 'react';
import { motion } from 'framer-motion';
import { FileAudio, FileVideo, Clock, Rocket } from 'lucide-react';

const Transcribe = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Transcribe Your Media
            </span>
          </h1>
          <p className="text-gray-300 text-center mb-8 text-lg">
            Transform your audio and video files into text with our AI-powered transcription service.
          </p>
        </motion.div>

        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-24 h-24 bg-purple-900/30 rounded-full flex items-center justify-center mb-6"
            >
              <Rocket className="h-12 w-12 text-purple-400" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Exciting Updates Coming Soon!
            </h2>
            
            <p className="text-gray-300 max-w-2xl mb-8">
              We're working hard to bring you an amazing transcription experience. Our team is fine-tuning the AI models and optimizing the service for the best possible results. Stay tuned!
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-purple-400">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Launch Expected Soon</span>
            </div>
          </div>
        </div>
        
        {/* Feature Preview Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Upcoming Features</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <FileAudio className="h-5 w-5 text-purple-400 mr-2" />
                Support for MP3 & WAV audio files
              </li>
              <li className="flex items-center">
                <FileVideo className="h-5 w-5 text-purple-400 mr-2" />
                MP4 video transcription
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Multi-language support
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Fast processing times
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">What to Expect</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                High accuracy transcription
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Easy file uploads up to 25MB
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download transcriptions instantly
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure file processing
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transcribe;