const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopBridge', {
  getAppInfo: () => ipcRenderer.invoke('desktop:get-app-info'),
  saveVideo: (payload) => ipcRenderer.invoke('desktop:save-video', payload),
});
