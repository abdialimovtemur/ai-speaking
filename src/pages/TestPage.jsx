import { useState, useEffect } from 'react';
import { useIELTSTest } from '../hooks/useIELTSTest';
import ControlButtons from '../components/ControlButtons';
import LiveExamInterface from '../components/LiveExamInterface';
import ExamResults from '../components/ExamResults';

const TestPage = () => {
  const {
    testState,
    log,
    feedback,
    finalEvaluation,
    timer,
    isStreaming,
    isMuted,
    examStatus,
    handleStartTest,
    handleSkipTimer,
    handleFinishPart2,
    handleRetry,
    handleToggleMute,
    handleRestart
  } = useIELTSTest();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Control buttons - only show during running exam */}
      {examStatus === 'running' && (
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
      )}

      {/* Conditionally render the main view based on exam status */}
      {examStatus === 'running' && (
        <LiveExamInterface
          testState={testState}
          log={log}
          feedback={feedback}
          timer={timer}
          isStreaming={isStreaming}
          isMuted={isMuted}
          handleSkipTimer={handleSkipTimer}
          handleFinishPart2={handleFinishPart2}
          handleRetry={handleRetry}
          handleToggleMute={handleToggleMute}
        />
      )}
      
      {examStatus === 'finished' && (
        <ExamResults
          finalEvaluation={finalEvaluation}
          log={log}
          feedback={feedback}
          onRestart={handleRestart}
        />
      )}

      {/* Initial state - show start button */}
      {examStatus === 'initial' && (
        <div className="flex justify-center">
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
      )}
    </main>
  );
};

export default TestPage;