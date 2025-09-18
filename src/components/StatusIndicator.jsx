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
    <div className={`flex items-center p-4 rounded-lg border ${statusInfo.className} mb-6`}>
      <div className="mr-3">
        <IconComponent iconName={statusInfo.icon} />
      </div>
      <div>
        <p className="font-medium">{statusInfo.text}</p>
        {timer !== null && (
          <p className="text-sm mt-1 flex items-center">
            <Clock className="w-4 h-4 mr-1" /> {formatTime(timer)}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatusIndicator;