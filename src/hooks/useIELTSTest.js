import { useState, useRef, useEffect, useCallback } from 'react';
import { TEST_STATE } from '../constants/testStates';

export const useIELTSTest = () => {
  const [testState, setTestState] = useState(TEST_STATE.INITIAL);
  const [log, setLog] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [finalEvaluation, setFinalEvaluation] = useState(null);
  const [timer, setTimer] = useState(null);

  const socket = useRef(null);
  const audioContext = useRef(null);
  const stream = useRef(null);
  const isStreaming = useRef(false);
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

  const stopAudio = useCallback(() => {
    if (stream.current) {
      stream.current.getTracks().forEach(track => track.stop());
      stream.current = null;
    }
    if (audioContext.current && audioContext.current.state !== 'closed') {
      audioContext.current.close().catch(e => console.error("Error closing AudioContext:", e));
      audioContext.current = null;
    }
    isStreaming.current = false;
    console.log("FRONTEND LOG: Audio resources released.");
  }, []);

  const handleStartTest = useCallback(() => {
    setTestState(TEST_STATE.CONNECTING);
    const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
    const backendUrl = '21fcd9672460.ngrok-free.app';
    const wsURL = `${wsScheme}://${backendUrl}/ws/speech/`;
    console.log("FRONTEND LOG: Connecting to WebSocket:", wsURL);
    const ws = new WebSocket(wsURL);

    const setupAudio = async () => {
      try {
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        stream.current = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 } });
        const workletURL = `/audio-streamer.js`;
        await audioContext.current.audioWorklet.addModule(workletURL);
        const audioWorkletNode = new AudioWorkletNode(audioContext.current, 'audio-streamer');
        const source = audioContext.current.createMediaStreamSource(stream.current);
        source.connect(audioWorkletNode);
        audioWorkletNode.port.onmessage = (event) => {
          if (isStreaming.current && ws.readyState === WebSocket.OPEN) {
            ws.send(event.data.buffer);
          }
        };
        return true;
      } catch (e) {
        console.error("FRONTEND LOG: Failed to initialize audio streaming:", e);
        setTestState(TEST_STATE.ERROR);
        ws.close();
        return false;
      }
    };

    ws.onopen = async () => {
      if (await setupAudio()) {
        setTestState(TEST_STATE.WAITING_FOR_AI);
      }
    };
    
    ws.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const audio = new Audio(URL.createObjectURL(event.data));
        setTestState(TEST_STATE.WAITING_FOR_AI);
        isStreaming.current = false;
        audio.play();
        audio.onended = () => {
          if (timerToStartOnFinish.current) {
            ws.send(JSON.stringify({ type: "tts_finished" }));
            timerToStartOnFinish.current = null;
          } else if (testStateRef.current !== TEST_STATE.ENDED) {
            ws.send(JSON.stringify({ type: "start_streaming" }));
            isStreaming.current = true;
            setTestState(TEST_STATE.READY_TO_LISTEN);
          }
        };
      } else {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'user_transcript':
            addToLog('You', data.text);
            setTestState(TEST_STATE.PROCESSING);
            break;
          case 'speech_enhancement':
            setFeedback(prev => [{ ...data, key: Date.now() }, ...prev]);
            break;
          case 'ai_response':
            addToLog('Examiner', data.text);
            timerToStartOnFinish.current = data.start_timer_on_finish || null;
            break;
          case 'final_evaluation':
            setFinalEvaluation(data.evaluation);
            setTestState(TEST_STATE.ENDED);
            stopAudio();
            ws.close();
            break;
          case 'timer_update':
            setTimer(data.remaining);
            if (data.timer_type === 'prep_timer') setTestState(TEST_STATE.PREP_TIME);
            else if (data.timer_type === 'speak_timer') {
              setTestState(TEST_STATE.SPEAK_TIME);
              isStreaming.current = true;
            }
            break;
          case 'timer_end':
            setTimer(null);
            break;
          case 'force_stop_streaming':
            isStreaming.current = false;
            break;
          default:
            break;
        }
      }
    };
    
    ws.onerror = (error) => {
      console.error("FRONTEND LOG: WebSocket Error:", error);
      setTestState(TEST_STATE.ERROR);
    };
    
    ws.onclose = () => {
      console.log("FRONTEND LOG: WebSocket disconnected.");
      stopAudio();
    };
    
    socket.current = ws;
  }, [addToLog, stopAudio]);

  const handleSkipTimer = () => {
    socket.current?.send(JSON.stringify({ type: "skip_prep_timer" }));
  };

  const handleFinishPart2 = () => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      isStreaming.current = false;
      socket.current.send(JSON.stringify({ type: "finish_part_2" }));
      setTestState(TEST_STATE.PROCESSING);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  useEffect(() => {
    return () => {
      if (socket.current) socket.current.close();
    };
  }, []);

  return {
    testState,
    log,
    feedback,
    finalEvaluation,
    timer,
    handleStartTest,
    handleSkipTimer,
    handleFinishPart2,
    handleRetry
  };
};