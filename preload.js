const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectVideo: () => ipcRenderer.invoke('select-video'),
  extractAudio: (path) => ipcRenderer.invoke('extract-audio', path),
  transcribe: (path, language) => ipcRenderer.invoke('transcribe', path, language)
});
