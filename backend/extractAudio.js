const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { app } = require("electron");

function extractAudio(videoPath) {
  return new Promise((resolve, reject) => {

    if (!videoPath) {
      return reject(new Error("Video path is undefined"));
    }

    const basePath = app.isPackaged
      ? path.join(process.resourcesPath, "resources")
      : path.join(__dirname, "..", "resources");

    const platform = process.platform;

    let ffmpegPath;

    if (platform === "darwin") {
      ffmpegPath = path.join(basePath, "mac", "ffmpeg");
    } else if (platform === "win32") {
      ffmpegPath = path.join(basePath, "win", "ffmpeg.exe");
    } else {
      return reject(new Error("Unsupported platform"));
    }

    if (!fs.existsSync(ffmpegPath)) {
      return reject(new Error("FFmpeg binary not found for this OS"));
    }

    const outputPath = videoPath.replace(/\.[^/.]+$/, ".wav");

    const command = `"${ffmpegPath}" -y -i "${videoPath}" -ar 16000 -ac 1 -c:a pcm_s16le "${outputPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        return reject(new Error("Audio extraction failed"));
      }

      resolve(outputPath);
    });
  });
}

module.exports = { extractAudio };
