export const TEST_STATE = {
  INITIAL: 'INITIAL',
  CONNECTING: 'CONNECTING',
  WAITING_FOR_AI: 'WAITING_FOR_AI',
  READY_TO_LISTEN: 'READY_TO_LISTEN',
  PROCESSING: 'PROCESSING',
  PREP_TIME: 'PREP_TIME',
  SPEAK_TIME: 'SPEAK_TIME',
  ENDED: 'ENDED',
  ERROR: 'ERROR'
};

export const STATUS_CONFIG = {
  [TEST_STATE.INITIAL]: {
    text: 'Click "Start IELTS Test" to begin.',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: 'Mic'
  },
  [TEST_STATE.CONNECTING]: {
    text: 'Connecting and setting up microphone...',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: 'Clock'
  },
  [TEST_STATE.WAITING_FOR_AI]: {
    text: 'AI is speaking...',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: 'Bot'
  },
  [TEST_STATE.READY_TO_LISTEN]: {
    text: 'Your turn. Start speaking whenever you\'re ready.',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: 'Mic'
  },
  [TEST_STATE.PROCESSING]: {
    text: 'Processing your response...',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: 'Clock'
  },
  [TEST_STATE.PREP_TIME]: {
    text: 'You have 1 minute to prepare your notes.',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: 'Clock'
  },
  [TEST_STATE.SPEAK_TIME]: {
    text: 'Your 2 minutes of speaking time has started.',
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: 'Mic'
  },
  [TEST_STATE.ENDED]: {
    text: 'Test Concluded. Review your detailed evaluation below.',
    className: 'bg-green-100 text-green-800 border-green-200',
    icon: 'Award'
  },
  [TEST_STATE.ERROR]: {
    text: 'Error. Please grant microphone permission and refresh.',
    className: 'bg-red-100 text-red-800 border-red-200',
    icon: 'AlertCircle'
  }
};