import { useState, useEffect } from 'react';
import { useIELTSTest } from '../hooks/useIELTSTest';
import StatusIndicator from '../components/StatusIndicator';
import VoiceActivityIndicator from '../components/VoiceActivityIndicator';
import ConversationLog from '../components/ConversationLog';
import FeedbackDropdown from '../components/FeedbackDropdown';
import FinalEvaluation from '../components/FinalEvaluation';
import ControlButtons from '../components/ControlButtons';
import TimerDisplay from '../components/TimerDisplay';
import { Award } from 'lucide-react';

const TestPage = () => {
  const {
    testState,
    log,
    feedback,
    finalEvaluation,
    timer,
    isStreaming,
    isMuted,
    handleStartTest,
    handleSkipTimer,
    handleFinishPart2,
    handleRetry,
    handleToggleMute
  } = useIELTSTest();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center mb-8">
        <ControlButtons
          testState={testState}
          onStartTest={handleStartTest}
          onSkipTimer={handleSkipTimer}
          onFinishPart2={handleFinishPart2}
          onRetry={handleRetry}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      </div>

      {finalEvaluation ? (
        // Full width layout for final evaluation
        <div className="space-y-8">
          {/* Final evaluation - full width */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Final Test Evaluation
            </h2>
            <FinalEvaluation data={finalEvaluation} />
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
      ) : (
        // Two-column layout for normal test flow
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
      )}
    </main>
  );
};

export default TestPage;