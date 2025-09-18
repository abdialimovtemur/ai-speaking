import Header from './components/Header';
import StatusIndicator from './components/StatusIndicator';
import ConversationLog from './components/ConversationLog';
import FeedbackDropdown from './components/FeedbackDropdown';
import FinalEvaluation from './components/FinalEvaluation';
import ControlButtons from './components/ControlButtons';
import { useIELTSTest } from './hooks/useIELTSTest';
import { Award } from 'lucide-react';

function App() {
  const {
    testState,
    log,
    feedback,
    finalEvaluation,
    timer,
    handleStartTest,
    handleSkipTimer,
    handleFinishPart2,
    handleRetry
  } = useIELTSTest();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <ControlButtons
            testState={testState}
            onStartTest={handleStartTest}
            onSkipTimer={handleSkipTimer}
            onFinishPart2={handleFinishPart2}
            onRetry={handleRetry}
          />
        </div>

        {finalEvaluation ? (
          // Two-column layout when final evaluation is shown
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mobile: Final Evaluation first, Desktop: Right column */}
            <div className="lg:col-span-1 lg:order-2">
              <div className="bg-white rounded-xl shadow-md p-6 lg:sticky lg:top-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-600" />
                  Final Test Evaluation
                </h2>
                <FinalEvaluation data={finalEvaluation} />
              </div>
            </div>

            {/* Mobile: Real-time Feedback second, Desktop: Left column */}
            <div className="lg:col-span-2 lg:order-1 space-y-6">
              <StatusIndicator testState={testState} timer={timer} />
              
              {feedback.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-purple-600" />
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
              
              {log.length > 0 && <ConversationLog logEntries={log} />}
            </div>
          </div>
        ) : (
          // Single column layout for normal test flow
          <div className="space-y-6">
            <StatusIndicator testState={testState} timer={timer} />
            {log.length > 0 && <ConversationLog logEntries={log} />}
            
            {feedback.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-600" />
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
        )}
      </main>
    </div>
  );
}

export default App;