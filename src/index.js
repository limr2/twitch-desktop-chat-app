const { app, BrowserWindow, ipcRenderer } = require('electron');
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
    frame: false,
    icon: path.join(__dirname, 'img/icon.png'),
    webPreferences: {
      // preload: path.join(app.getAppPath(), 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  // shows the page after electron finishes setup
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    chatWindow.open(false)
  })  

  // set bounds of window (location and size)
  winBounds = config.get('window.app.bounds', {x: 550, y: 225, width: 400, height: 450})
  mainWindow.setBounds(winBounds)

  // disables resizing of window (TBD if in final version)
  mainWindow.setResizable(false)


  // loads main page of the app
  mainWindow.loadFile(path.join(__dirname, 'app.html'));
  
  // remembers postiion of window
  mainWindow.on('move', function(){
    saveWinBounds()
  })

  // remembers size of window
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
  mainWindow.webContents.openDevTools();
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

const { ipcMain } = require("electron");

var prefs = require('./js/main/prefs_main.js')

var overlay = require('./js/main/overlay_main.js');

var twitch = require('./js/main/twitch_main.js')





// title bar handlers
ipcMain.handle('minimize-app-window', async function(event){
  mainWindow.minimize()
})

ipcMain.handle('close-app-window', async function(event){
  twitch.disconnect()
  mainWindow.close()
})

// update channel
 
ipcMain.handle('update-channel', async function(event, channel){
  config.set('channel', channel)

  twitch.disconnect()
  overlay.clear()
  twitch.connect(channel)

})

// create overlay window

var chatWindow = require('./js/main/window.js')

twitch.setChatWin(chatWindow.getWin())

ipcMain.handle('connect-twitch', async function(event, channel){
  twitch.connect(channel)
})

