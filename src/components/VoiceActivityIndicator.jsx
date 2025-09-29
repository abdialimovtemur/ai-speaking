import { Mic, Bot } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const VoiceActivityIndicator = ({ testState, isStreaming, isMuted }) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Determine if we should show the indicator
  const shouldShow = testState === 'WAITING_FOR_AI' || testState === 'READY_TO_LISTEN' || testState === 'SPEAK_TIME';
  
  // Determine if user is speaking (streaming) or AI is speaking
  const isUserSpeaking = isStreaming && (testState === 'READY_TO_LISTEN' || testState === 'SPEAK_TIME');
  const isAISpeaking = testState === 'WAITING_FOR_AI';
  
  // Show user mic when user should be speaking (including SPEAK_TIME even if not streaming yet)
  const showUserMic = isUserSpeaking || testState === 'SPEAK_TIME' || (isMuted && (testState === 'READY_TO_LISTEN' || testState === 'SPEAK_TIME'));

  // Real voice detection for user
  useEffect(() => {
    if (!isUserSpeaking) {
      // Clean up if not speaking
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsActive(false);
      setAudioLevel(0);
      return;
    }

    // Initialize audio analysis when user should be speaking
    const initAudioAnalysis = async () => {
      try {
        // Get microphone access
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: false 
        });
        
        // Create audio context and analyser
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        // Connect microphone to analyser
        const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
        source.connect(analyserRef.current);
        
        // Create data array for analysis
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        
        // Function to analyze audio and update state
        const analyzeAudio = () => {
          if (!analyserRef.current) return;
          
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          
          // Normalize to 0-100 scale with more sensitivity
          const normalizedLevel = Math.min(100, Math.max(0, average * 1.2));
          
          // Update state - use threshold to determine if actively speaking
          setAudioLevel(normalizedLevel);
          setIsActive(normalizedLevel > 5);
          
          // Continue animation - faster update for user speaking
          animationFrameRef.current = requestAnimationFrame(analyzeAudio);
        };
        
        // Start analysis with faster updates
        animationFrameRef.current = requestAnimationFrame(analyzeAudio);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        // Fallback to simulated animation if microphone access fails
        const interval = setInterval(() => {
          setAudioLevel(Math.random() * 80 + 20);
          setIsActive(true);
        }, 50); // Faster interval for user (was 100ms)
        
        return () => clearInterval(interval);
      }
    };

    initAudioAnalysis();

    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [isUserSpeaking]);

  // AI speaking animation - same style as user but with different color
  useEffect(() => {
    if (!isAISpeaking) {
      setAudioLevel(0);
      setIsActive(false);
      return;
    }

    // AI animates with random values like user but consistent
    let lastValue = 30;
    const interval = setInterval(() => {
      // Create more natural looking animation with smoother transitions
      const newValue = Math.min(100, Math.max(20, lastValue + (Math.random() * 40 - 20)));
      lastValue = newValue;
      setAudioLevel(newValue);
      setIsActive(true);
    }, 80); // Keep AI at normal speed
    
    return () => {
      clearInterval(interval);
      setIsActive(false);
    };
  }, [isAISpeaking]);

  if (!shouldShow) return null;

  // Determine colors based on who is speaking and mute state
  const primaryColor = (showUserMic && isMuted) ? 'red' : (showUserMic ? 'green' : 'blue');
  const icon = showUserMic ? <Mic className="w-10 h-10" /> : <Bot className="w-10 h-10" />;

  // Calculate bar heights - Enhanced for user, normal for AI
  const getBarHeight = (index, level) => {
    const baseHeight = 10;
    const maxHeight = showUserMic ? 50 + (index * 15) : 35 + (index * 12); // Taller bars for user
    const variation = (index % 2 === 0 ? 0.8 : 1.2); // Create alternating pattern
    
    if (!isActive) return baseHeight;
    
    // Calculate height based on audio level with variation for each bar
    const multiplier = showUserMic ? 1.5 : 1; // More dramatic for user
    return baseHeight + (level / 100) * maxHeight * variation * multiplier;
  };

  return (
    <div className="flex justify-center items-center mb-16">
      <div className="relative">
        {/* Voice-responsive bars - only show when actively speaking */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 rounded-full ${
                  showUserMic 
                    ? 'transition-all duration-50' // Faster transition for user
                    : 'transition-all duration-100' // Normal for AI
                } ${
                  (showUserMic && isMuted)
                    ? 'bg-gradient-to-t from-red-400 to-red-600'
                    : showUserMic 
                      ? 'bg-gradient-to-t from-green-400 to-green-600' 
                      : 'bg-gradient-to-t from-blue-400 to-blue-600'
                }`}
                style={{
                  height: `${getBarHeight(i, audioLevel)}px`,
                  transform: `rotate(${i * 45}deg) translateY(-${30 + i * 6}px)`,
                  opacity: 0.9 - (i * 0.08),
                }}
              />
            ))}
          </div>
        )}

        {/* Main icon container - enhanced for user, opaque for AI */}
        <div className={`relative w-32 h-32 rounded-full flex items-center justify-center z-20 ${
          showUserMic 
            ? 'transition-all duration-100' // Faster transition for user
            : 'transition-all duration-300' // Normal for AI
        } ${
          (showUserMic && isMuted)
            ? 'bg-gradient-to-br from-red-100 to-red-300 shadow-xl shadow-red-300/60 transform scale-110' // Red for muted user
            : isActive 
              ? showUserMic
                ? 'bg-gradient-to-br from-green-100 to-green-300 shadow-xl shadow-green-300/60 transform scale-110' // More dramatic for user
                : 'bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg shadow-blue-200/60' // Opaque for AI
              : showUserMic
                ? 'bg-gradient-to-br from-green-50 to-green-100 shadow-md shadow-green-100/30'
                : 'bg-gradient-to-br from-blue-50 to-blue-100 shadow-md shadow-blue-100/30' // Opaque for AI
        }`}>
          {/* Inner glow effect - pulses when active */}
          <div className={`absolute inset-4 rounded-full ${
            showUserMic 
              ? 'transition-all duration-100' // Faster transition for user
              : 'transition-all duration-300' // Normal for AI
          } ${
            (showUserMic && isMuted)
              ? 'bg-gradient-to-br from-red-200 to-red-300 animate-pulse' // Red for muted user
              : isActive 
                ? showUserMic
                  ? 'bg-gradient-to-br from-green-200 to-green-300 animate-pulse'
                  : 'bg-gradient-to-br from-blue-200 to-blue-300 animate-pulse' // Opaque for AI
                : showUserMic
                  ? 'bg-gradient-to-br from-green-100 to-green-200'
                  : 'bg-gradient-to-br from-blue-100 to-blue-200' // Opaque for AI
          }`}></div>
          
          {/* Icon */}
          <div className={`relative z-10 ${
            showUserMic 
              ? 'transition-colors duration-100' // Faster transition for user
              : 'transition-colors duration-300' // Normal for AI
          } ${
            isActive ? `text-${primaryColor}-700` : `text-${primaryColor}-500`
          }`}>
            {icon}
          </div>
        </div>

        {/* Outer ring - expands when active */}
        <div className={`absolute inset-0 rounded-full border-4 ${
          showUserMic 
            ? 'transition-all duration-100' // Faster transition for user
            : 'transition-all duration-300' // Normal for AI
        } ${
          (showUserMic && isMuted)
            ? 'border-red-300'
            : `border-${primaryColor}-300`
        }`} style={{
          transform: `scale(${isActive ? 1.15 + (audioLevel / 400) : 1})`,
          opacity: isActive ? 0.7 : 0.3,
        }}></div>

         {/* Status text */}
         <div className="absolute -bottom-12 left-0 right-0 text-center text-sm font-medium py-2">
           {showUserMic ? (
             <span className={
               (showUserMic && isMuted)
                 ? 'text-red-600 font-semibold' 
                 : (isActive ? `text-${primaryColor}-600 font-semibold` : 'text-gray-500')
             }>
               {isMuted ? 'Microphone muted' : (isActive ? 'Speaking...' : 'Ready to speak')}
             </span>
           ) : (
             <span className={isActive ? `text-${primaryColor}-600 font-semibold` : 'text-gray-500'}>
               {isActive ? 'AI is speaking...' : 'AI is thinking'}
             </span>
           )}
         </div>
      </div>
    </div>
  );
};

export default VoiceActivityIndicator;