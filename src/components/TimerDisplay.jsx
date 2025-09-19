import { Clock } from 'lucide-react';

const TimerDisplay = ({ timer, testState }) => {
  if (timer === null) return null;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerConfig = () => {
    if (testState === 'PREP_TIME') {
      return {
        title: 'Preparation Time',
        subtitle: 'Prepare your notes',
        bgColor: 'from-amber-400 to-orange-500',
        ringColor: 'border-amber-300',
        textColor: 'text-amber-900',
        iconColor: 'text-amber-700'
      };
    } else if (testState === 'SPEAK_TIME') {
      return {
        title: 'Speaking Time',
        subtitle: 'Share your thoughts',
        bgColor: 'from-red-400 to-pink-500',
        ringColor: 'border-red-300',
        textColor: 'text-red-900',
        iconColor: 'text-red-700'
      };
    }
    return {
      title: 'Timer',
      subtitle: 'Time remaining',
      bgColor: 'from-blue-400 to-indigo-500',
      ringColor: 'border-blue-300',
      textColor: 'text-blue-900',
      iconColor: 'text-blue-700'
    };
  };

  const config = getTimerConfig();
  const progress = testState === 'PREP_TIME' ? (60 - timer) / 60 : (120 - timer) / 120;

  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        {/* Main Timer Container */}
        <div className={`
          relative w-48 h-48 rounded-full 
          bg-gradient-to-br ${config.bgColor} 
          shadow-2xl border-4 ${config.ringColor}
          flex flex-col items-center justify-center
          transform transition-all duration-300 hover:scale-105
        `}>
          {/* Progress Ring */}
          <div className="absolute inset-0 rounded-full">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
          </div>

          {/* Timer Content */}
          <div className="relative z-10 text-center">
            <Clock className={`w-8 h-8 mx-auto mb-2 ${config.iconColor}`} />
            <div className={`text-4xl font-bold ${config.textColor} mb-1`}>
              {formatTime(timer)}
            </div>
            <div className={`text-sm font-medium ${config.textColor} opacity-80`}>
              {config.title}
            </div>
          </div>

          {/* Pulsing Effect */}
          <div className={`
            absolute inset-0 rounded-full 
            bg-gradient-to-br ${config.bgColor} 
            opacity-20 animate-pulse
          `}></div>
        </div>

        {/* Subtitle */}
        <div className="text-center mt-4">
          <p className="text-lg font-medium text-gray-700">
            {config.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
