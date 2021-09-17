const { app, BrowserWindow } = require('electron');
const path = require('path');
var config = require('electron-json-config');
const { main } = require('@popperjs/core');

var mainWindow = null
var winBounds = null

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    backgroundColor: '#2c2a4a',
    minWidth: 400,
    maxWidth: 500,
    minHeight: 450,
    frame: false,
    icon: path.join(__dirname, 'img/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setResizable(false)
  })

  winBounds = config.get('window.app.bounds', {x: 550, y: 225, width: 400, height: 450})
  mainWindow.setBounds(winBounds)

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'app.html'));
  

  mainWindow.on('move', function(){
    saveWinBounds()
  })

  // remembers window position and size after resize
  mainWindow.on('resize', function(){
    saveWinBounds()
  })



  mainWindow.on('close', function(){
    mainWindow.webContents.executeJavaScript(`
      if(winChat) winChat.close();
    `)
    mainWindow.webContents.executeJavaScript(`
      savePersistedSettings();
    `)
    
  })
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here

const saveWinBounds = () => {
  if(!mainWindow) return
  winBounds = mainWindow.getBounds()
  config.set('window.app.bounds', winBounds)
}