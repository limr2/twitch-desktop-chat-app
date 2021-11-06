const { app, BrowserWindow, ipcRenderer } = require('electron');
const path = require('path');
var config = require('electron-json-config');
const { main } = require('@popperjs/core');

var mainWindow = null
var winBounds = null

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
  return;
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
    chatWindow.open()
    chatWindow.setMainWin(mainWindow, app);
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
    app.quit()
    
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

// title bar handlers
ipcMain.handle('minimize-app-window', async function(event){
  mainWindow.minimize()
})

ipcMain.handle('close-app-window', async function(event){
  // twitch.disconnect()
  mainWindow.close()
})

// create overlay window

var chatWindow = require('./js/main/chatWindow_main.js')

var bm = require('./js/api/twitch-api.js')

// rose's twitch id
var t_id = 152928496


async function test(){
  let x = await bm.getBadges(15234534532453246543768768795)
  console.log(`>>>>>>>>>>>>>> x: ${JSON.stringify(x, null, 4)}`)
}

test()