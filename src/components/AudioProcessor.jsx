// server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up storage for audio files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `audio_${timestamp}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    // Accept audio files only
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed!"), false);
    }
  },
});

// Routes
app.post("/api/upload-audio", upload.single("audio"), (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No audio file uploaded" });
    }

    // Here you can add additional processing like:
    // 1. Save metadata to a database
    // 2. Process the audio file (e.g., transcription, analysis)
    // 3. Forward the file to another service

    console.log(`Received audio: ${req.file.filename}`);

    // Example: Process the audio (in a real app, you might use a queue)
    processAudio(req.file.path);

    res.status(200).json({
      success: true,
      message: "Audio uploaded successfully",
      filename: req.file.filename,
      fileSize: req.file.size,
    });
  } catch (error) {
    console.error("Error handling upload:", error);
    res.status(500).json({
      success: false,
      message: "Server error during upload",
    });
  }
});

// Get list of all audio files
app.get("/api/audio-files", (req, res) => {
  const dir = "./uploads";

  if (!fs.existsSync(dir)) {
    return res.status(200).json({ files: [] });
  }

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error reading files" });
    }

    // Filter only audio files
    const audioFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".webm", ".mp3", ".wav", ".ogg"].includes(ext);
    });

    res.status(200).json({
      success: true,
      files: audioFiles.map((filename) => ({
        filename,
        url: `/api/audio/${filename}`,
        timestamp: fs.statSync(path.join(dir, filename)).mtime,
      })),
    });
  });
});

// Serve audio files
app.get("/api/audio/:filename", (req, res) => {
  const filePath = path.join("./uploads", req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  res.sendFile(path.resolve(filePath));
});

// Sample audio processing function
function processAudio(filePath) {
  // This is where you would implement your audio processing logic
  // For example:
  // 1. Analyze audio for quality, loudness, etc.
  // 2. Send to a transcription service
  // 3. Extract metadata

  console.log(`Processing audio file: ${filePath}`);

  // Simulated processing - in a real application, this might be:
  // - Using an audio processing library
  // - Sending to an external API
  // - Storing metadata in a database

  // For demo purposes, just log that we've processed the file
  setTimeout(() => {
    console.log(`Finished processing: ${filePath}`);
  }, 1000);
}

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
