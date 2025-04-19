import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  // Try multiple possible paths for the index.html file
  const possiblePaths = [
    path.join(__dirname, '../dist/index.html'),
    path.join(__dirname, './dist/index.html'),
    path.join(process.resourcesPath, 'app.asar/dist/index.html'),
    path.join(app.getAppPath(), 'dist/index.html'),
    path.join(__dirname, '../../../dist/index.html')
  ];

  // Find the first path that exists
  let indexPath = null;
  for (const p of possiblePaths) {
    console.log('Trying path:', p);
    if (fs.existsSync(p)) {
      indexPath = p;
      console.log('Found index.html at:', indexPath);
      break;
    }
  }

  if (indexPath) {
    mainWindow.loadFile(indexPath);
  } else {
    console.error('Could not find index.html in any of the expected locations');
    mainWindow.loadURL('data:text/html,<h1>Error: Could not find index.html</h1><p>Check the console for details</p>');
  }
  
  // Open DevTools for debugging
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
