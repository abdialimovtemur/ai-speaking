import { Mic, Clock, Bot, Award, AlertCircle } from 'lucide-react';
import { STATUS_CONFIG } from '../constants/testStates';

const IconComponent = ({ iconName }) => {
  switch (iconName) {
    case 'Mic':
      return <Mic className="w-5 h-5" />;
    case 'Clock':
      return <Clock className="w-5 h-5" />;
    case 'Bot':
      return <Bot className="w-5 h-5" />;
    case 'Award':
      return <Award className="w-5 h-5" />;
    case 'AlertCircle':
      return <AlertCircle className="w-5 h-5" />;
    default:
      return <Mic className="w-5 h-5" />;
  }
};

const StatusIndicator = ({ testState, timer }) => {
  const statusInfo = STATUS_CONFIG[testState];
  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  return (
    <div className={`flex items-center p-6 rounded-2xl border-2 shadow-lg backdrop-blur-sm ${statusInfo.className} mb-6 relative z-10`}>
      <div className="mr-4 p-2 rounded-full bg-white/50">
        <IconComponent iconName={statusInfo.icon} />
      </div>
      <div>
        <p className="font-semibold text-lg">{statusInfo.text}</p>
        {timer !== null && (
          <p className="text-sm mt-2 flex items-center font-medium">
            <Clock className="w-4 h-4 mr-2" /> {formatTime(timer)}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatusIndicator;