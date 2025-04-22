import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const AudioFileProcessor = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Upload an audio file");
  const [audioSegments, setAudioSegments] = useState([]);
  const [progress, setProgress] = useState(0);
  const [processingSettings, setProcessingSettings] = useState({
    silenceThreshold: 0.05,
    silenceDuration: 10,
    chunkSize: 30, // Process 30 seconds at a time
  });

  const audioContextRef = useRef(null);
  const fileReaderRef = useRef(null);
  const currentChunkRef = useRef(0);
  const totalChunksRef = useRef(0);
  const processedSegmentsRef = useRef([]);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      setStatusMessage(`File selected: ${file.name}`);
      setAudioSegments([]);
      setProgress(0);
      processedSegmentsRef.current = [];
    } else {
      setStatusMessage("Please select a valid audio file");
      setAudioFile(null);
    }
  };

  // Handle settings change
  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setProcessingSettings({
      ...processingSettings,
      [name]: parseFloat(value),
    });
  };

  // Start processing the audio file
  const processAudio = async () => {
    if (!audioFile) {
      setStatusMessage("No audio file selected");
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage("Starting audio processing...");
      setProgress(0);
      processedSegmentsRef.current = [];

      // Initialize audio context
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Get file duration first
      const audioDuration = await getAudioDuration(audioFile);

      // Calculate number of chunks
      const chunkSizeSeconds = processingSettings.chunkSize;
      const totalChunks = Math.ceil(audioDuration / chunkSizeSeconds);
      totalChunksRef.current = totalChunks;
      currentChunkRef.current = 0;

      setStatusMessage(
        `Audio duration: ${audioDuration.toFixed(
          2
        )}s. Processing in ${totalChunks} chunks...`
      );

      // Start processing chunks
      processNextChunk();
    } catch (error) {
      console.error("Error processing audio:", error);
      setStatusMessage(`Error: ${error.message}`);
      setIsProcessing(false);
    }
  };

  // Get the duration of the audio file
  const getAudioDuration = (file) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => resolve(audio.duration);
      audio.onerror = (e) => reject(new Error("Error loading audio metadata"));
      audio.src = URL.createObjectURL(file);
    });
  };

  // Process audio in chunks
  const processNextChunk = async () => {
    const chunkIndex = currentChunkRef.current;

    if (chunkIndex >= totalChunksRef.current) {
      // All chunks processed
      setStatusMessage(
        `Completed processing ${processedSegmentsRef.current.length} segments`
      );
      setIsProcessing(false);
      setAudioSegments(processedSegmentsRef.current);
      return;
    }

    const chunkSizeSeconds = processingSettings.chunkSize;
    const startTime = chunkIndex * chunkSizeSeconds;
    let endTime = startTime + chunkSizeSeconds;

    // For last chunk, calculate exact end time
    if (chunkIndex === totalChunksRef.current - 1) {
      const audio = new Audio(URL.createObjectURL(audioFile));
      await new Promise((resolve) => {
        audio.onloadedmetadata = () => {
          endTime = Math.min(endTime, audio.duration);
          resolve();
        };
      });
    }

    setStatusMessage(
      `Processing chunk ${chunkIndex + 1}/${
        totalChunksRef.current
      } (${startTime.toFixed(1)}s - ${endTime.toFixed(1)}s)...`
    );

    try {
      // Extract chunk from file
      const chunkBlob = await extractAudioChunk(audioFile, startTime, endTime);

      // Process chunk
      const segments = await processAudioChunk(chunkBlob, startTime);

      // Add segments to the list with global time offsets
      if (segments.length > 0) {
        processedSegmentsRef.current = [
          ...processedSegmentsRef.current,
          ...segments,
        ];
        setAudioSegments([...processedSegmentsRef.current]); // Update UI
      }

      // Send new segments to server in the background
      segments.forEach((segment) => {
        sendSegmentToServer(segment);
      });

      // Update progress
      currentChunkRef.current++;
      setProgress(
        Math.floor((currentChunkRef.current / totalChunksRef.current) * 100)
      );

      // Process next chunk
      processNextChunk();
    } catch (error) {
      console.error(`Error processing chunk ${chunkIndex}:`, error);
      setStatusMessage(
        `Error processing chunk ${chunkIndex}: ${error.message}`
      );
      setIsProcessing(false);
    }
  };

  // Extract a specific time range from the audio file
  const extractAudioChunk = async (file, startTime, endTime) => {
    // For a proper implementation, you would need to:
    // 1. Use Web Audio API to extract a time range from the audio file
    // 2. Create a new AudioBuffer from that range
    // 3. Convert it to a Blob

    // This is a simplified version that just returns the whole file
    // In a production app, you'd implement proper time slicing
    return file;
  };

  // Process a single audio chunk
  const processAudioChunk = async (chunkBlob, timeOffset) => {
    try {
      // Read chunk as array buffer
      const arrayBuffer = await readFileAsArrayBuffer(chunkBlob);

      // Decode audio data
      const audioBuffer = await audioContextRef.current.decodeAudioData(
        arrayBuffer
      );

      // Detect silence and create segments
      return detectSilenceAndSegment(audioBuffer, timeOffset);
    } catch (error) {
      console.error("Error processing audio chunk:", error);
      throw error;
    }
  };

  // Read file as array buffer
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  // Detect silence and segment audio
  const detectSilenceAndSegment = async (audioBuffer, timeOffset = 0) => {
    const channels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const duration = audioBuffer.duration;

    // Get audio data (using first channel for analysis)
    const audioData = audioBuffer.getChannelData(0);

    const segments = [];
    let segmentStart = 0;
    let silenceStart = null;

    // Step size for analysis (in seconds)
    const analysisStepSize = 0.1; // 100ms chunks for analysis
    const samplesPerStep = Math.floor(sampleRate * analysisStepSize);
    const silenceThresholdSamples = Math.floor(
      processingSettings.silenceDuration / analysisStepSize
    );

    let silenceCounter = 0;

    // Analyze audio in chunks
    for (let i = 0; i < duration / analysisStepSize; i++) {
      const chunkStart = i * samplesPerStep;
      const chunkEnd = Math.min((i + 1) * samplesPerStep, audioData.length);

      // Calculate RMS volume
      let sum = 0;
      for (let j = chunkStart; j < chunkEnd; j++) {
        sum += audioData[j] * audioData[j]; // Square of amplitude
      }
      const rms = Math.sqrt(sum / (chunkEnd - chunkStart));

      // Check if current chunk is silent
      if (rms < processingSettings.silenceThreshold) {
        if (silenceStart === null) {
          silenceStart = i * analysisStepSize;
        }
        silenceCounter++;

        // If silence exceeds threshold, create a segment
        if (
          silenceCounter >= silenceThresholdSamples &&
          segmentStart < silenceStart
        ) {
          const segmentBuffer = await createAudioSegment(
            audioBuffer,
            segmentStart,
            silenceStart
          );

          segments.push({
            start: timeOffset + segmentStart,
            end: timeOffset + silenceStart,
            duration: silenceStart - segmentStart,
            buffer: segmentBuffer,
          });

          segmentStart = (i + 1) * analysisStepSize; // Start next segment after silence
        }
      } else {
        silenceStart = null;
        silenceCounter = 0;
      }
    }

    // Add final segment if needed
    if (segmentStart < duration) {
      const segmentBuffer = await createAudioSegment(
        audioBuffer,
        segmentStart,
        duration
      );

      segments.push({
        start: timeOffset + segmentStart,
        end: timeOffset + duration,
        duration: duration - segmentStart,
        buffer: segmentBuffer,
      });
    }

    return segments;
  };

  // Create audio segment from specific time range
  const createAudioSegment = async (sourceBuffer, startTime, endTime) => {
    const sampleRate = sourceBuffer.sampleRate;
    const channels = sourceBuffer.numberOfChannels;

    const startSample = Math.floor(startTime * sampleRate);
    const endSample = Math.floor(endTime * sampleRate);
    const frameCount = endSample - startSample;

    // Create new buffer for the segment
    const segmentBuffer = audioContextRef.current.createBuffer(
      channels,
      frameCount,
      sampleRate
    );

    // Copy data for each channel
    for (let channel = 0; channel < channels; channel++) {
      const sourceData = sourceBuffer.getChannelData(channel);
      const newData = segmentBuffer.getChannelData(channel);

      for (let i = 0; i < frameCount; i++) {
        newData[i] = sourceData[startSample + i];
      }
    }

    // Convert buffer to blob for sending to server
    const blob = await audioBufferToBlob(segmentBuffer);
    return blob;
  };

  // Convert audio buffer to blob
  const audioBufferToBlob = async (buffer) => {
    return new Promise((resolve) => {
      const offlineContext = new OfflineAudioContext(
        buffer.numberOfChannels,
        buffer.length,
        buffer.sampleRate
      );

      const source = offlineContext.createBufferSource();
      source.buffer = buffer;
      source.connect(offlineContext.destination);
      source.start(0);

      offlineContext.startRendering().then((renderedBuffer) => {
        const wav = bufferToWav(renderedBuffer);
        const blob = new Blob([wav], { type: "audio/wav" });
        resolve(blob);
      });
    });
  };

  // Convert buffer to WAV format
  const bufferToWav = (buffer) => {
    const numOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numOfChannels * 2;
    const sampleRate = buffer.sampleRate;
    const blockAlign = numOfChannels * 2;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length;

    const buffer1 = new ArrayBuffer(44 + dataSize);
    const dv = new DataView(buffer1);

    let p = 0;

    // Write WAV header
    writeString(dv, p, "RIFF");
    p += 4;
    dv.setUint32(p, 36 + dataSize, true);
    p += 4;
    writeString(dv, p, "WAVE");
    p += 4;
    writeString(dv, p, "fmt ");
    p += 4;
    dv.setUint32(p, 16, true);
    p += 4;
    dv.setUint16(p, 1, true);
    p += 2;
    dv.setUint16(p, numOfChannels, true);
    p += 2;
    dv.setUint32(p, sampleRate, true);
    p += 4;
    dv.setUint32(p, byteRate, true);
    p += 4;
    dv.setUint16(p, blockAlign, true);
    p += 2;
    dv.setUint16(p, 16, true);
    p += 2;
    writeString(dv, p, "data");
    p += 4;
    dv.setUint32(p, dataSize, true);
    p += 4;

    // Write audio data
    const channelsData = [];
    for (let i = 0; i < numOfChannels; i++) {
      channelsData.push(buffer.getChannelData(i));
    }

    let offset = 0;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channelsData[channel][i]));
        const val = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        dv.setInt16(p + offset, val, true);
        offset += 2;
      }
    }

    return buffer1;
  };

  // Helper function to write string to DataView
  const writeString = (dv, offset, str) => {
    for (let i = 0; i < str.length; i++) {
      dv.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // Send a single audio segment to server
  const sendSegmentToServer = async (segment) => {
    try {
      const formData = new FormData();
      formData.append(
        "audio",
        segment.buffer,
        `segment_${segment.start.toFixed(2)}_${segment.end.toFixed(2)}.wav`
      );
      formData.append("startTime", segment.start);
      formData.append("endTime", segment.end);
      formData.append("duration", segment.duration);

      const response = await axios.post(
        "http://localhost:5000/api/upload-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        `Segment ${segment.start.toFixed(2)}-${segment.end.toFixed(
          2
        )} sent successfully:`,
        response.data
      );
    } catch (error) {
      console.error(
        `Error sending segment ${segment.start.toFixed(
          2
        )}-${segment.end.toFixed(2)}:`,
        error
      );
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Real-time Audio Silence Detector
      </h2>

      <div className="mb-4">
        <p className="text-gray-600">{statusMessage}</p>

        {isProcessing && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Processing Settings
        </label>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-xs text-gray-500">
              Silence Threshold
            </label>
            <input
              type="range"
              name="silenceThreshold"
              min="0.01"
              max="0.2"
              step="0.01"
              value={processingSettings.silenceThreshold}
              onChange={handleSettingChange}
              className="w-full"
              disabled={isProcessing}
            />
            <span className="text-xs">
              {processingSettings.silenceThreshold}
            </span>
          </div>

          <div>
            <label className="block text-xs text-gray-500">
              Silence Duration (s)
            </label>
            <input
              type="range"
              name="silenceDuration"
              min="1"
              max="30"
              step="1"
              value={processingSettings.silenceDuration}
              onChange={handleSettingChange}
              className="w-full"
              disabled={isProcessing}
            />
            <span className="text-xs">
              {processingSettings.silenceDuration}s
            </span>
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-xs text-gray-500">Chunk Size (s)</label>
          <input
            type="range"
            name="chunkSize"
            min="10"
            max="60"
            step="5"
            value={processingSettings.chunkSize}
            onChange={handleSettingChange}
            className="w-full"
            disabled={isProcessing}
          />
          <span className="text-xs">{processingSettings.chunkSize}s</span>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={isProcessing}
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={processAudio}
          disabled={!audioFile || isProcessing}
          className={`px-4 py-2 rounded font-bold ${
            !audioFile || isProcessing
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isProcessing ? "Processing..." : "Process Audio"}
        </button>
      </div>

      {audioSegments.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">
            Audio Segments ({audioSegments.length}):
          </h3>
          <div className="max-h-60 overflow-y-auto">
            {audioSegments.map((segment, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                <p className="text-sm">
                  Segment {index + 1}: {segment.start.toFixed(2)}s -{" "}
                  {segment.end.toFixed(2)}s ({segment.duration.toFixed(2)}s)
                </p>
                <audio
                  controls
                  className="mt-1 w-full"
                  src={URL.createObjectURL(segment.buffer)}
                ></audio>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-2 bg-gray-100 rounded">
        <p className="text-sm">
          <strong>How it works:</strong> This processor will analyze your audio
          file in chunks of {processingSettings.chunkSize} seconds, detect
          silent periods of {processingSettings.silenceDuration} seconds or
          more, split the audio accordingly, and send each segment to the server
          in real-time.
        </p>
      </div>
    </div>
  );
};

export default AudioFileProcessor;
