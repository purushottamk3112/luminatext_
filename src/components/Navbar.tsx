import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Menu, X, Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { checkApiHealth, getApiHealthDetails } from '../services/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHealthy, setIsHealthy] = useState(true);
  const [healthDetails, setHealthDetails] = useState<{ healthy: boolean; message?: string; error?: string }>({ healthy: true });
  const [isChecking, setIsChecking] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setIsChecking(true);
        console.log('🔍 Checking backend health...');
        
        const details = await getApiHealthDetails();
        setHealthDetails(details);
        setIsHealthy(details.healthy);
        
        console.log('✅ Health check result:', details);
      } catch (error) {
        console.error('❌ Health check failed:', error);
        setIsHealthy(false);
        setHealthDetails({ healthy: false, error: 'Check failed' });
      } finally {
        setIsChecking(false);
      }
    };

    // Check immediately on mount
    checkHealth();
    
    // Then check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleManualCheck = () => {
    checkHealth();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Transcribe', path: '/transcribe' },
    { name: 'About', path: '/about' },
    { name: 'History', path: '/history' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Mic className="h-8 w-8 text-purple-400" />
            </motion.div>
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              LuminaText
            </span>
          </Link>

          {/* Desktop Menu & Status */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-white bg-purple-600'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Enhanced Backend Status Indicator */}
            <div className="flex items-center space-x-2 ml-4">
              {isChecking ? (
                <>
                  <div className="h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-yellow-400">Checking...</span>
                </>
              ) : isHealthy ? (
                <>
                  <Wifi className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-green-400">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-400" />
                  <span className="text-xs text-red-400">Offline</span>
                </>
              )}
              
              {/* Manual refresh button */}
              <button
                onClick={handleManualCheck}
                className="p-1 rounded hover:bg-gray-700 transition-colors"
                title="Check connection"
              >
                <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''} text-gray-400 hover:text-white`} />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-gray-800"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-white bg-purple-600'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {/* Mobile status */}
            <div className="px-3 py-2 flex items-center space-x-2">
              {isChecking ? (
                <>
                  <div className="h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-yellow-400">Checking...</span>
                </>
              ) : isHealthy ? (
                <>
                  <Wifi className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">Backend Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-red-400">Backend Offline</span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
