import { TEST_STATE } from '../constants/testStates.js';
class WebSocketService {
  constructor() {
    this.socket = null;
    this.isAuthenticated = false;
    this.isStreaming = false;
    this.isMuted = false;
    this.audioContext = null;
    this.stream = null;
    this.audioWorkletNode = null;
    this.callbacks = {};
    this.isExpectingEnhancementAudio = false;
  }

  setCallbacks(callbacks) {
    this.callbacks = callbacks;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        reject(new Error('No access token found. Please log in.'));
        return;
      }

      // --- THIS IS THE FIX ---
      // When connecting to a secure ngrok URL, the scheme MUST be 'wss'
      const wsScheme = "wss"; 
      const backendUrl = '9d65191b4d76.ngrok-free.app'; // Remember to update this
      const wsURL = `${wsScheme}://${backendUrl}/ws/speech/`;
      // --- END FIX ---

      console.log("FRONTEND LOG: Connecting to WebSocket with URL:", wsURL);
      this.socket = new WebSocket(wsURL);

      this.socket.onopen = async () => {
        console.log("FRONTEND LOG: WebSocket connected, sending authentication token");
        
        this.socket.send(JSON.stringify({
          type: "authenticate",
          token: accessToken   
        }));
        
        try {
          await this.setupAudio();
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      this.socket.onmessage = (event) => {
        this.handleMessage(event);
      };

      this.socket.onerror = (error) => {
        console.error("FRONTEND LOG: WebSocket Error:", error);
        this.callbacks.onError?.(error);
      };

      this.socket.onclose = (event) => {
        console.log("FRONTEND LOG: WebSocket disconnected. Code:", event.code, "Reason:", event.reason);
        this.stopAudio();
        this.callbacks.onClose?.(event);
      };
    });
  }

  // Setup audio streaming
  async setupAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true } 
      });

      // Audio processor code
      const audioProcessor = `
        class AudioStreamer extends AudioWorkletProcessor {
          process(inputs, outputs, parameters) {
            const input = inputs[0];
            if (input.length > 0) { 
              this.port.postMessage(this.floatTo16BitPCM(input[0])); 
            }
            return true;
          }
          
          floatTo16BitPCM(input) {
            const output = new Int16Array(input.length);
            for (let i = 0; i < input.length; i++) {
              const s = Math.max(-1, Math.min(1, input[i]));
              output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            return output;
          }
        }
        registerProcessor('audio-streamer', AudioStreamer);
      `;

      // Load audio worklet from string
      const blob = new Blob([audioProcessor], { type: 'application/javascript' });
      const workletURL = URL.createObjectURL(blob);
      await this.audioContext.audioWorklet.addModule(workletURL);
      
      this.audioWorkletNode = new AudioWorkletNode(this.audioContext, 'audio-streamer');
      const source = this.audioContext.createMediaStreamSource(this.stream);
      source.connect(this.audioWorkletNode);
      
      this.audioWorkletNode.port.onmessage = (event) => {
        // Only send audio after authentication
        if (this.isAuthenticated && this.isStreaming && this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(event.data);
        }
      };
      
      this.audioWorkletNode.connect(this.audioContext.destination);
      return true;
    } catch (e) {
      console.error("FRONTEND LOG: Failed to initialize audio streaming:", e);
      throw e;
    }
  }

  // Handle incoming messages
  handleMessage(event) {
    if (event.data instanceof Blob) {
      // Audio response - check if it's enhancement audio or regular AI response
      if (this.isExpectingEnhancementAudio) {
        // This is enhancement audio
        const audio = new Audio(URL.createObjectURL(event.data));
        this.callbacks.onEnhancementAudioResponse?.(audio);
        this.isExpectingEnhancementAudio = false;
      } else {
        // This is regular AI response audio
        const audio = new Audio(URL.createObjectURL(event.data));
        this.callbacks.onAudioResponse?.(audio);
      }
    } else {
      // JSON data
      const data = JSON.parse(event.data);
      console.log("FRONTEND LOG: Received message:", data);
      
      switch (data.type) {
        case 'auth_success':
          console.log("FRONTEND LOG: Authentication successful");
          this.isAuthenticated = true;
          this.callbacks.onAuthSuccess?.();
          break;
        case 'auth_error':
          console.error("FRONTEND LOG: Authentication failed:", data.message);
          this.callbacks.onAuthError?.(data.message);
          break;
        case 'user_transcript':
          this.callbacks.onUserTranscript?.(data.text);
          break;
        case 'speech_enhancement':
          this.callbacks.onSpeechEnhancement?.(data);
          break;
        case 'ai_response':
          this.callbacks.onAIResponse?.(data);
          break;
        case 'final_evaluation':
          this.callbacks.onFinalEvaluation?.(data.evaluation);
          break;
        case 'timer_update':
          this.callbacks.onTimerUpdate?.(data);
          break;
        case 'timer_end':
          this.callbacks.onTimerEnd?.();
          break;
        case 'force_stop_streaming':
          this.isStreaming = false;
          break;
        case 'enhancement_audio_start':
          // This message tells us the NEXT blob of audio is for an enhancement
          this.isExpectingEnhancementAudio = true;
          break;
        default:
          console.log("FRONTEND LOG: Unknown message type:", data.type);
          break;
      }
    }
  }

  // Send message
  sendMessage(message) {
    if (this.socket?.readyState === WebSocket.OPEN && this.isAuthenticated) {
      this.socket.send(JSON.stringify(message));
    }
  }

  // Start streaming
  startStreaming() {
    this.isStreaming = true;
  }

  // Stop streaming
  stopStreaming() {
    this.isStreaming = false;
  }

  // Mute microphone using MediaStream track
  mute() {
    if (this.stream) {
      this.stream.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
      this.isMuted = true;
      console.log("FRONTEND LOG: Microphone muted");
    }
  }

  // Unmute microphone using MediaStream track
  unmute() {
    if (this.stream) {
      this.stream.getAudioTracks().forEach(track => {
        track.enabled = true;
      });
      this.isMuted = false;
      console.log("FRONTEND LOG: Microphone unmuted");
    }
  }

  // Toggle mute state
  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
    return this.isMuted;
  }

  // Stop audio
  stopAudio() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(e => console.error("Error closing AudioContext:", e));
      this.audioContext = null;
    }
    this.isStreaming = false;
    console.log("FRONTEND LOG: Audio resources released.");
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.stopAudio();
    this.isAuthenticated = false;
    this.isMuted = false;
  }
}

export default new WebSocketService();
