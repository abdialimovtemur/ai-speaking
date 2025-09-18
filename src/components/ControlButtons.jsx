import { Mic, Clock, MicOff, AlertCircle } from 'lucide-react';
import { TEST_STATE } from '../constants/testStates';

const ControlButtons = ({ testState, onStartTest, onSkipTimer, onFinishPart2, onRetry }) => {
  if (testState === TEST_STATE.INITIAL) {
    return (
      <button
        onClick={onStartTest}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center"
      >
        <Mic className="w-5 h-5 mr-2" /> Start IELTS Test
      </button>
    );
  }

  if (testState === TEST_STATE.CONNECTING) {
    return (
      <button
        disabled
        className="bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center"
      >
        <Clock className="w-5 h-5 mr-2 animate-pulse" /> Connecting...
      </button>
    );
  }

  if (testState === TEST_STATE.ERROR) {
    return (
      <button
        onClick={onRetry}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center"
      >
        <AlertCircle className="w-5 h-5 mr-2" /> Try Again
      </button>
    );
  }

  if (testState === TEST_STATE.PREP_TIME) {
    return (
      <button
        onClick={onSkipTimer}
        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center"
      >
        I'm Ready
      </button>
    );
  }

  if (testState === TEST_STATE.SPEAK_TIME) {
    return (
      <button
        onClick={onFinishPart2}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center"
      >
        <MicOff className="w-5 h-5 mr-2" /> I'm Finished
      </button>
    );
  }

  return null;
};

export default ControlButtons;