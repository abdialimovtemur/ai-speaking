import { useState } from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';

const ConversationLog = ({ logEntries }) => {
  const [copiedItems, setCopiedItems] = useState(new Set());

  const handleCopy = async (text, entryKey) => {
    try {
      // Remove HTML tags for clean text
      const cleanText = text.replace(/<[^>]*>/g, '');
      await navigator.clipboard.writeText(cleanText);
      
      // Add to copied items
      setCopiedItems(prev => new Set([...prev, entryKey]));
      
      // Remove from copied items after 2 seconds
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(entryKey);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
      Conversation
    </h2>
    <div className="space-y-4">
      {logEntries.map((entry) => (
        <div key={entry.key} className={`p-5 rounded-xl shadow-sm border-l-4 ${
          entry.speaker === 'You' 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500 ml-auto max-w-3xl' 
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500 mr-auto max-w-3xl'
        }`}>
          <div className={`flex items-center mb-3 ${
            entry.speaker === 'You' ? 'justify-end' : 'justify-start'
          }`}>
            {entry.speaker === 'You' ? (
              <div className="bg-green-500 p-2 rounded-full mr-3 order-2 ml-2">
                <User className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="bg-blue-500 p-2 rounded-full mr-3">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <strong className={`font-semibold ${
              entry.speaker === 'You' ? 'text-green-700 order-1' : 'text-blue-700'
            }`}>
              {entry.speaker}
            </strong>
          </div>
          <div className="text-gray-700 leading-relaxed text-left relative group">
            {entry.html ? (
              <div dangerouslySetInnerHTML={{ __html: entry.html }} />
            ) : (
              <p>{entry.text}</p>
            )}
            
            {/* Copy Button */}
            <button
              onClick={() => handleCopy(entry.html || entry.text, entry.key)}
              className={`absolute bottom-[-25px] right-[-25px] p-2 rounded-lg transition-all duration-200 ${
                entry.speaker === 'You' 
                  ? 'bg-green-100 hover:bg-green-200 text-green-600' 
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
              }`}
              title="Copy text"
            >
              {copiedItems.has(entry.key) ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default ConversationLog;