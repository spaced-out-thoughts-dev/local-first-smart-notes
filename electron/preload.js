/**
 * Electron preload script
 * Exposes safe APIs to the renderer process
 */
import { contextBridge, ipcRenderer } from 'electron';

// Expose LLM API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // LLM functions
  initLLM: (config) => ipcRenderer.invoke('llm:init', config),
  loadModel: (modelName) => ipcRenderer.invoke('llm:loadModel', modelName),
  generate: (prompt, config) => ipcRenderer.invoke('llm:generate', prompt, config),
  chat: (messages, config) => ipcRenderer.invoke('llm:chat', messages, config),
});