const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

// Configuración básica
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 450,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Asegúrate de que esta línea esté permitida
    },
  });

  win.setMenuBarVisibility(false); // Esto quita la barra de menú
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdates(); // Verifica actualizaciones al iniciar la aplicación
});

autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Actualización disponible',
    message: 'Se está descargando una nueva versión.',
  });
});

autoUpdater.on('update-downloaded', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Actualización lista',
    message: 'La actualización se instalará ahora.',
  }).then(() => {
    autoUpdater.quitAndInstall(); // Forzar instalación de la actualización
  });
});

autoUpdater.on('error', (err) => {
  dialog.showMessageBox({
    type: 'error',
    title: 'Error en la actualización',
    message: `Error: ${err.message}`
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
