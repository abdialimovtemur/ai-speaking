import { useNavigate } from 'react-router-dom';
import { useIELTSTest } from '../hooks/useIELTSTest';
import { useAuth } from '../contexts/AuthContext';
import StatusIndicator from '../components/StatusIndicator';
import VoiceActivityIndicator from '../components/VoiceActivityIndicator';
import ConversationLog from '../components/ConversationLog';
import FeedbackDropdown from '../components/FeedbackDropdown';
import FinalEvaluation from '../components/FinalEvaluation';
import ControlButtons from '../components/ControlButtons';
import TimerDisplay from '../components/TimerDisplay';
import { Award, Mic } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
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

  const handleStartTestWithAuth = () => {
    if (isAuthenticated) {
      handleStartTest();
    } else {
      navigate('/login', { state: { from: '/' } });
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Show ControlButtons only when test is not in initial state */}
      {testState !== 'INITIAL' && (
        <div className="flex justify-center mb-8">
          <ControlButtons
            testState={testState}
            onStartTest={handleStartTestWithAuth}
            onSkipTimer={handleSkipTimer}
            onFinishPart2={handleFinishPart2}
            onRetry={handleRetry}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        </div>
      )}

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
      ) : testState === 'INITIAL' ? (
        // Simple welcome section when test hasn't started
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
          {/* Simple info */}
          <div className="text-center max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              AI-Powered IELTS Speaking Test
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Practice your IELTS Speaking skills with our advanced AI examiner
            </p>
          </div>

          {/* Enhanced Start Button */}
          <div className="mt-8">
            <button
              onClick={handleStartTestWithAuth}
              className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-6 px-12 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Mic className="w-8 h-8 mr-3 relative z-10" />
              <span className="text-xl relative z-10">Start IELTS Test</span>
              <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </button>
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

export default HomePage;
