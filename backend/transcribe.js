const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { app } = require("electron");

function transcribeAudio(audioPath, language = "auto") {
  return new Promise((resolve, reject) => {

    if (!audioPath) {
      return reject(new Error("Audio path undefined"));
    }

    const basePath = app.isPackaged
      ? path.join(process.resourcesPath, "resources")
      : path.join(__dirname, "..", "resources");

    const platform = process.platform;

    let whisperPath;

    if (platform === "darwin") {
      whisperPath = path.join(basePath, "mac", "whisper-cli");
    } else if (platform === "win32") {
      whisperPath = path.join(basePath, "win", "whisper-cli.exe");
    } else {
      return reject(new Error("Unsupported platform"));
    }

    const modelPath = path.join(basePath, "models", "ggml-base.bin");

    if (!fs.existsSync(whisperPath)) {
      return reject(new Error("Whisper binary not found for this OS"));
    }

    if (!fs.existsSync(modelPath)) {
      return reject(new Error("Model file not found"));
    }

    let languageOption = "";

    if (language !== "auto") {
      languageOption = `-l ${language}`;
    }

    const command = `"${whisperPath}" -m "${modelPath}" -f "${audioPath}" ${languageOption} -osrt`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        return reject(new Error("Transcription failed"));
      }

      resolve(audioPath + ".srt");
    });
  });
}

module.exports = { transcribeAudio };
