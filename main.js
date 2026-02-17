const { transcribeAudio } = require('./backend/transcribe');
const { extractAudio } = require('./backend/extractAudio');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false
    }
  }
);

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('select-video', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Videos', extensions: ['mp4', 'mov', 'mkv'] }
    ]
  });

  if (result.canceled) return null;
  return result.filePaths[0];
});

ipcMain.handle('extract-audio', async (event, videoPath) => {
  return await extractAudio(videoPath);
});

ipcMain.handle('transcribe', async (event, audioPath, language) => {
  return await transcribeAudio(audioPath, language);
});


