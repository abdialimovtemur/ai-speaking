import { BookOpen, Play, Square, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import websocketService from '../services/websocketService';

const FeedbackDropdown = ({ originalText, enhancements }) => {
  const [isOpen, setIsOpen] = useState(true); // Avtomatik ochiq
  const [activeBand, setActiveBand] = useState('Band 7');
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // Listen for enhancement audio responses to reset loading state
  useEffect(() => {
    const handleEnhancementAudio = () => {
      setIsLoadingAudio(false);
    };

    // Add a custom event listener for enhancement audio
    window.addEventListener('enhancementAudioReceived', handleEnhancementAudio);
    
    return () => {
      window.removeEventListener('enhancementAudioReceived', handleEnhancementAudio);
    };
  }, []);

  const renderDiff = (diffData) => {
    if (!diffData || !Array.isArray(diffData)) return 'Suggestion not available.';
    
    return diffData.map((part, i) => (
      <span
        key={i}
        className={
          part.type === 'added'
            ? 'bg-green-100 text-green-800'
            : part.type === 'removed'
            ? 'bg-red-100 text-red-800 line-through'
            : ''
        }
      >
        {part.value}
      </span>
    ));
  };

  const handlePlay = (e, text) => {
    e.stopPropagation();
    
    if (!websocketService.socket || websocketService.socket.readyState !== WebSocket.OPEN || !text) {
      console.error("Socket not available or no text to play.");
      return;
    }

    // Set loading state to provide user feedback
    setIsLoadingAudio(true);

    // Send the text to the backend to get TTS audio
    websocketService.sendMessage({
      type: 'get_enhancement_audio',
      text: text
    });

    // Set a timeout to reset loading state if no response comes
    setTimeout(() => {
      setIsLoadingAudio(false);
    }, 10000); // 10 second timeout
  };

  const handleStop = (e) => {
    e.stopPropagation();
    setIsLoadingAudio(false);
    // Note: We can't easily stop WebSocket audio once it starts playing
    // The audio will play to completion
  };

  return (
    <div className="border border-gray-200/50 rounded-2xl overflow-hidden mb-4 bg-white/60 backdrop-blur-sm shadow-lg">
      <div
        className={`flex justify-between items-center p-5 cursor-pointer bg-gradient-to-r from-gray-50/80 to-blue-50/80 hover:from-gray-100/80 hover:to-blue-100/80 transition-all duration-300 ${
          isOpen ? 'border-b border-gray-200/50' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center min-w-0 flex-1">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-lg mr-3 flex-shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-800 truncate">Feedback for: "{originalText}"</span>
        </div>
        <div className={`transform transition-transform duration-300 flex-shrink-0 ml-2 p-1 rounded-full bg-white/50 ${isOpen ? 'rotate-180' : ''}`}>
          <span className="text-gray-600">&#9660;</span>
        </div>
      </div>
      
      {isOpen && (
        <div className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="flex space-x-2 mb-4">
            {['Band 7', 'Band 8', 'Band 9'].map((band) => (
              <button
                key={band}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeBand === band
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveBand(band);
                  setIsLoadingAudio(false);
                }}
              >
                {band}
              </button>
            ))}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-3">
            <p className="mb-3">{renderDiff(enhancements[activeBand]?.diff)}</p>
            <div className="flex space-x-2">
              <button
                className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={(e) => handlePlay(e, enhancements[activeBand]?.text)}
                disabled={isLoadingAudio}
              >
                {isLoadingAudio ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-1" />
                )}
                {isLoadingAudio ? 'Loading...' : 'Play'}
              </button>
              <button
                className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                onClick={handleStop}
              >
                <Square className="w-4 h-4 mr-1" /> Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackDropdown;