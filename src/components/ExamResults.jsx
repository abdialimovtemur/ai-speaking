import FinalEvaluation from './FinalEvaluation';
import ConversationLog from './ConversationLog';
import FeedbackDropdown from './FeedbackDropdown';
import { Award, RotateCcw } from 'lucide-react';

const ExamResults = ({ 
  finalEvaluation, 
  log, 
  feedback, 
  onRestart 
}) => {
  return (
    <div className="space-y-8">
      {/* Final evaluation - full width */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-blue-600" />
          Final Test Evaluation
        </h2>
        <FinalEvaluation data={finalEvaluation} />
      </div>
      
      {/* Restart button */}
      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Take Test Again
        </button>
      </div>
      
      {/* Feedback and Conversation side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Real-time Feedback */}
        {feedback.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Real-time Feedback
            </h2>
            <div className="space-y-4">
              {feedback.map(fb => (
                <FeedbackDropdown 
                  key={fb.key} 
                  originalText={fb.original_text || fb.originalText || 'Your speech'} 
                  enhancements={fb.enhancements} 
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Conversation Log */}
        {log.length > 0 && (
          <div className="h-fit">
            <ConversationLog logEntries={log} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamResults;
