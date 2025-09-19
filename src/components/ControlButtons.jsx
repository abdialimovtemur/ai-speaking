import { Mic, Clock, MicOff, AlertCircle } from 'lucide-react';
import { TEST_STATE } from '../constants/testStates';

const ControlButtons = ({ testState, onStartTest, onSkipTimer, onFinishPart2, onRetry }) => {
  if (testState === TEST_STATE.INITIAL) {
    return (
      <button
        onClick={onStartTest}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center transform hover:scale-105"
      >
        <Mic className="w-5 h-5 mr-2" /> Start IELTS Test
      </button>
    );
  }

  if (testState === TEST_STATE.CONNECTING) {
    return (
      <button
        disabled
        className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white font-semibold py-4 px-8 rounded-xl shadow-lg flex items-center opacity-75"
      >
        <Clock className="w-5 h-5 mr-2 animate-pulse" /> Connecting...
      </button>
    );
  }

  if (testState === TEST_STATE.ERROR) {
    return (
      <button
        onClick={onRetry}
        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center transform hover:scale-105"
      >
        <AlertCircle className="w-5 h-5 mr-2" /> Try Again
      </button>
    );
  }

  if (testState === TEST_STATE.PREP_TIME) {
    return (
      <button
        onClick={onSkipTimer}
        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center transform hover:scale-105"
      >
        I'm Ready
      </button>
    );
  }

  if (testState === TEST_STATE.SPEAK_TIME) {
    return (
      <button
        onClick={onFinishPart2}
        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center transform hover:scale-105"
      >
        <MicOff className="w-5 h-5 mr-2" /> I'm Finished
      </button>
    );
  }

  return null;
};

export default ControlButtons;