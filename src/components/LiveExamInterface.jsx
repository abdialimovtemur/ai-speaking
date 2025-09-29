import StatusIndicator from './StatusIndicator';
import VoiceActivityIndicator from './VoiceActivityIndicator';
import ConversationLog from './ConversationLog';
import FeedbackDropdown from './FeedbackDropdown';
import ControlButtons from './ControlButtons';
import TimerDisplay from './TimerDisplay';
import { Award } from 'lucide-react';

const LiveExamInterface = ({
  testState,
  log,
  feedback,
  timer,
  isStreaming,
  isMuted,
  handleSkipTimer,
  handleFinishPart2,
  handleRetry,
  handleToggleMute
}) => {
  return (
    <div className="space-y-6">
      {/* Show TimerDisplay for preparation and speaking phases */}
      {(testState === 'PREP_TIME' || testState === 'SPEAK_TIME') && (
        <TimerDisplay timer={timer} testState={testState} />
      )}
      
      {/* Show StatusIndicator only when VoiceActivityIndicator is not showing and no timer */}
      {(testState !== 'WAITING_FOR_AI' && testState !== 'READY_TO_LISTEN' && testState !== 'SPEAK_TIME' && testState !== 'PREP_TIME') && (
        <StatusIndicator testState={testState} timer={timer} />
      )}
      <VoiceActivityIndicator testState={testState} isStreaming={isStreaming} isMuted={isMuted} />
      
      {/* Two-column layout: Conversation on left, Feedback on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Conversation Log - takes 2/3 of the width */}
        <div className="lg:col-span-2">
          {log.length > 0 && <ConversationLog logEntries={log} />}
        </div>
        
        {/* Real-time Feedback - takes 1/3 of the width on the right */}
        <div className="lg:col-span-1">
          {feedback.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Award className="w-4 h-4 mr-2 text-blue-600" />
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
        </div>
      </div>
    </div>
  );
};

export default LiveExamInterface;
