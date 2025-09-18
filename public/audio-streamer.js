// In public/audio-streamer.js (This is the correct version)

class AudioStreamer extends AudioWorkletProcessor {
    // This function converts the float audio data from the microphone
    // into the 16-bit PCM format that the backend's VAD expects.
    floatTo16BitPCM(input) {
        const output = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return output;
    }

    process(inputs, outputs, parameters) {
        // We only care about the first input, which is the microphone.
        const input = inputs[0];
        if (input.length > 0 && input[0].length > 0) {
            // Convert the audio data and post it back to the main thread.
            // The .buffer is what we send over the WebSocket.
            this.port.postMessage(this.floatTo16BitPCM(input[0]));
        }
        // Return true to keep the processor alive.
        return true;
    }
}

registerProcessor('audio-streamer', AudioStreamer);