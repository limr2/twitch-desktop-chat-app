var config = require('electron-json-config');

const { BrowserWindow, ipcMain } = require('electron');
const path = require('path')

chatWindow = null



const open = () => {
    
    // electron create window
    chatWindow = new BrowserWindow({
        minWidth: 200,
        minHeight: 200,
        transparent: true,
        frame: false,
        icon: path.join(__dirname, '../../img/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    // forces window to always be in front
    chatWindow.setAlwaysOnTop(true, 'screen');
    
    // sets window position/size from previous instance
    // default bounds:               {x: 100, y: 100, width: 400, height: 800}
    config.get('window.chat.bounds', {x: 100, y: 100, width: 400, height: 800})
    chatWindow.setBounds(winBounds)

    // loads html file
    chatWindow.loadFile(path.join(__dirname, '../../chat.html'));

    // remembers window position and size after moving
    chatWindow.on('move', function(){
        saveWinBounds()
    })

    // remembers window position and size after resize
    chatWindow.on('resize', function(){
        saveWinBounds()
    })

    // remmembers window position and size when closing, and disconnects the chat bot
    chatWindow.on('before-quit', function(){
        saveWinBounds()

        // disconnects the twitch bot
    })
}

module.exports.open = open

// saves postion/size of chat window
function saveWinBounds() {

    // checks to make sure chatWindow exists
    if(!chatWindow)
        return

    // gets bounds
    bounds = chatWindow.getBounds()

    // saves to config
    config.set('window.chat.bounds', bounds)
}

const updatePrefs = (pref, data) => {

    // checks to make sure chatWindow exists
    if(!chatWindow){
        console.log(`Error: chatWindow_main.js => updatePrefs() - chatWindow doesnt exist`)
        return
    }

    // sends the upated pref to chat renderer
    chatWindow.webContents.send('update-chat-pref', pref, data)
}

module.exports.updatePrefs = updatePrefs


const lock = () => {

    // checks to make sure chatWindow exists
    if(!chatWindow){
        console.log(`Error: chatWindow_main.js => lock() - chatWindow doesnt exist`)
        return
    }

    // disables user interaction with chat window (can click thru)
    chatWindow.setIgnoreMouseEvents(true)
   
    // hides the border
    chatWindow.webContents.executeJavaScript(`document.getElementById('chat-body').classList.remove('frame')`)

    // updates config
    config.set('window.chat.locked', true)
}


module.exports.lock = lock

const unlock = () => {

    // checks to make sure chatWindow exists
    if(!chatWindow){
        console.log(`Error: chatWindow_main.js => unlock() - chatWindow doesnt exist`)
        return
    }

    // enables user interaction with chat window (can move/resize)
    chatWindow.setIgnoreMouseEvents(false)

    // shows the border
    chatWindow.webContents.executeJavaScript(`document.getElementById('chat-body').classList.add('frame')`)
    
    // updates config
    config.set('window.chat.locked', false)
}

module.exports.unlock = unlock

var twitch = require('./js/main/twitch_main.js')

twitch.setChatWin(chatWindow)

