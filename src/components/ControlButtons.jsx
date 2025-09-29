import { Mic, Clock, MicOff, AlertCircle, VolumeX, Volume2 } from 'lucide-react';
import { TEST_STATE } from '../constants/testStates';

const ControlButtons = ({ testState, onStartTest, onSkipTimer, onFinishPart2, onRetry, isMuted, onToggleMute }) => {
  if (testState === TEST_STATE.INITIAL) {
    return (
      <button
        onClick={onStartTest}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center transform hover:scale-105"
      >
        {/* <Mic className="w-5 h-5 mr-2" /> Start IELTS Test */}
        Start IELTS Test
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
      <div className="flex gap-4 items-center">
        <button
          onClick={onToggleMute}
          className={`font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center transform hover:scale-105 ${
            isMuted 
              ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
          }`}
        >
          {isMuted ? <VolumeX className="w-5 h-5 mr-2" /> : <Volume2 className="w-5 h-5 mr-2" />}
          {isMuted ? 'Unmuteee' : 'Muteeeee'}
        </button>
        <button
          onClick={onFinishPart2}
          className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center transform hover:scale-105"
        >
          <MicOff className="w-5 h-5 mr-2" /> I'm Finished
        </button>
      </div>
    );
  }

  // Show mute button only when user is speaking (not when AI is speaking)
  if (testState === TEST_STATE.READY_TO_LISTEN || testState === TEST_STATE.PROCESSING) {
    return (
      <button
        onClick={onToggleMute}
        className={`font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center transform hover:scale-105 ${
          isMuted 
            ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white' 
            : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
        }`}
      >
        {isMuted ? <VolumeX className="w-5 h-5 mr-2" /> : <Volume2 className="w-5 h-5 mr-2" />}
        {isMuted ? 'Unmuteeee' : 'Muteeee'}
      </button>
    );
  }

  return null;
};

export default ControlButtons;