import { BookOpen, Play, Square } from 'lucide-react';
import { useState } from 'react';

const FeedbackDropdown = ({ originalText, enhancements }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeBand, setActiveBand] = useState('Band 7');

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
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleStop = (e) => {
    e.stopPropagation();
    speechSynthesis.cancel();
  };

  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      <div
        className={`flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 ${
          isOpen ? 'border-b' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center min-w-0 flex-1">
          <BookOpen className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
          <span className="font-medium truncate">Feedback for: "{originalText}"</span>
        </div>
        <span className={`transform transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`}>
          &#9660;
        </span>
      </div>
      
      {isOpen && (
        <div className="p-4 bg-white">
          <div className="flex space-x-2 mb-4">
            {['Band 7', 'Band 8', 'Band 9'].map((band) => (
              <button
                key={band}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeBand === band
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveBand(band);
                  speechSynthesis.cancel();
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
                className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                onClick={(e) => handlePlay(e, enhancements[activeBand]?.text)}
              >
                <Play className="w-4 h-4 mr-1" /> Play
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