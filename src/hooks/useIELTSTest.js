import { useState, useRef, useEffect, useCallback } from 'react';
import { TEST_STATE } from '../constants/testStates';
import websocketService from '../services/websocketService';

export const useIELTSTest = () => {
  const [testState, setTestState] = useState(TEST_STATE.INITIAL);
  const [log, setLog] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [finalEvaluation, setFinalEvaluation] = useState(null);
  const [timer, setTimer] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const timerToStartOnFinish = useRef(null);
  const testStateRef = useRef(testState);

  useEffect(() => {
    testStateRef.current = testState;
  }, [testState]);

  const addToLog = useCallback((speaker, text) => {
    const newEntry = { speaker, text, key: Date.now(), html: null };
    if (speaker === 'Examiner' && text.includes('[CUE_CARD_START]')) {
      const parts = text.split(/\[CUE_CARD_START\]|\[CUE_CARD_END\]/);
      const cueCardText = parts[1].trim().replace(/\n/g, '<br />');
      newEntry.html = `${parts[0]}<div class="bg-purple-50 border-l-4 border-purple-500 p-4 mt-3 rounded-r">${cueCardText}</div>`;
    }
    setLog(prevLog => [newEntry, ...prevLog]);
  }, []);

  const handleStartTest = useCallback(async () => {
    setTestState(TEST_STATE.CONNECTING);
    setIsAuthenticated(false);

    try {
      // Set up WebSocket callbacks
      websocketService.setCallbacks({
        onAuthSuccess: () => {
          setIsAuthenticated(true);
          setTestState(TEST_STATE.WAITING_FOR_AI);
        },
        onAuthError: (message) => {
          console.error("FRONTEND LOG: Authentication failed:", message);
          setTestState(TEST_STATE.ERROR);
        },
        onUserTranscript: (text) => {
          addToLog('You', text);
          setTestState(TEST_STATE.PROCESSING);
        },
        onSpeechEnhancement: (data) => {
          setFeedback(prev => [{ ...data, key: Date.now() }, ...prev]);
        },
        onAIResponse: (data) => {
          addToLog('Examiner', data.text);
          timerToStartOnFinish.current = data.start_timer_on_finish || null;
        },
        onFinalEvaluation: (evaluation) => {
          setFinalEvaluation(evaluation);
          setTestState(TEST_STATE.ENDED);
          websocketService.disconnect();
        },
        onTimerUpdate: (data) => {
          setTimer(data.remaining);
          if (data.timer_type === 'prep_timer') {
            setTestState(TEST_STATE.PREP_TIME);
          } else if (data.timer_type === 'speak_timer') {
            setTestState(TEST_STATE.SPEAK_TIME);
            websocketService.startStreaming();
          }
        },
        onTimerEnd: () => {
          setTimer(null);
        },
        onAudioResponse: (audio) => {
          setTestState(TEST_STATE.WAITING_FOR_AI);
          websocketService.stopStreaming();
          audio.play();
          audio.onended = () => {
            if (timerToStartOnFinish.current) {
              websocketService.sendMessage({ type: "tts_finished" });
              timerToStartOnFinish.current = null;
            } else if (testStateRef.current !== TEST_STATE.ENDED) {
              websocketService.sendMessage({ type: "start_streaming" });
              websocketService.startStreaming();
              setTestState(TEST_STATE.READY_TO_LISTEN);
            }
          };
        },
        onError: (error) => {
          console.error("FRONTEND LOG: WebSocket Error:", error);
          setTestState(TEST_STATE.ERROR);
        },
        onClose: (event) => {
          if (testStateRef.current !== TEST_STATE.ENDED && testStateRef.current !== TEST_STATE.ERROR) {
            setTestState(TEST_STATE.ERROR);
          }
        },
      });

      // Connect to WebSocket
      await websocketService.connect();
    } catch (error) {
      console.error("FRONTEND LOG: Failed to start test:", error);
      setTestState(TEST_STATE.ERROR);
    }
  }, [addToLog]);

  const handleSkipTimer = useCallback(() => {
    websocketService.sendMessage({ type: "skip_prep_timer" });
  }, []);

  const handleFinishPart2 = useCallback(() => {
    websocketService.stopStreaming();
    websocketService.sendMessage({ type: "finish_part_2" });
    setTestState(TEST_STATE.PROCESSING);
  }, []);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const handleToggleMute = useCallback(() => {
    const newMuteState = websocketService.toggleMute();
    setIsMuted(newMuteState);
  }, []);

  useEffect(() => {
    return () => {
      websocketService.disconnect();
    };
  }, []);

  return {
    testState,
    log,
    feedback,
    finalEvaluation,
    timer,
    isStreaming: websocketService.isStreaming,
    isAuthenticated,
    isMuted,
    handleStartTest,
    handleSkipTimer,
    handleFinishPart2,
    handleRetry,
    handleToggleMute
  };
};