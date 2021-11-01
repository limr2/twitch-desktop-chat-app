var https = require('https');

var config = require('electron-json-config');

const { BrowserWindow, ipcMain, app } = require('electron');
const path = require('path')

chatWindow = null
winBounds = config.get('window.chat.bounds')



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
    // default bounds:                           {x: 100, y: 100, width: 400, height: 800}
    winBounds = config.get('window.chat.bounds', {x: 100, y: 100, width: 400, height: 800})
    chatWindow.setBounds(winBounds)

    // loads html file
    chatWindow.loadFile(path.join(__dirname, '../../chat.html'));

    // remembers window position and size after moving
    chatWindow.on('move', function(){
        saveWinBounds()

    })

    // disables right click on chat overlay
    chatWindow.on("system-context-menu", (event, _point) => {
        event.preventDefault();
    });

    // remembers window position and size after resize
    chatWindow.on('resize', function(){
        saveWinBounds()
    })

    // remmembers window position and size when closing, and disconnects the chat bot
    chatWindow.on('before-quit', function(){
        saveWinBounds()

        // disconnects the twitch bot
    })

    // chatWindow.webContents.openDevTools();
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
        console.log(`Error: chatWindow_main.js => updatePrefs(${pref}, ${data}) - chatWindow doesnt exist`)
        return
    }

    // sends the upated pref to chat renderer
    chatWindow.webContents.send('update-chat-pref', pref, data)
}

module.exports.updatePrefs = updatePrefs

const updateFadeoutDelay = (time) => {
    
    // checks to make sure chatWindow exists
    if(!chatWindow){
        console.log(`Error: chatWindow_main.js => updateFadeoutDelay(${time}) - chatWindow doesnt exist`)
        return
    }

    
    // sends the upated pref to chat renderer
    chatWindow.webContents.send('update-fadeout-delay', time)
}

module.exports.updateFadeoutDelay = updateFadeoutDelay

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

var twitch = require('./twitch_main.js')

twitch.setChatWin(chatWindow)

async function updateTwitchInfo(username){
    const options = {
        host: 'api.jgdif.com',
        port: 443,
        path: `/twitch/user/${username}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': 0,
        }
    }

    return new Promise(async function(resolve, reject){
        const req = await https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            res.on('data', d => {
                let schema = JSON.parse(d);
                resolve(schema)
            });
        })
        
        req.on('error', error => {
            console.log(error)
            reject(error)
        })

        req.end()
    })
}

const updateChannelText = (pref, value) => {
    // console.log(`Updating: ${pref}: ${value}`)
    chatWindow.webContents.send(`update-chat-text`, pref, value)
}

module.exports.updateChannelText = updateChannelText

var badgeManager = require('./badge_manager.js')

var mainWindow = null;
var mainApp = null;
const setMainWin = (window, app) => {
    mainWindow = window
    mainApp =  app
}
module.exports.setMainWin =setMainWin

ipcMain.handle('update-channel', async function(event, channel){

    var twitchInfo = await updateTwitchInfo(channel);
    config.set('channel', twitchInfo['displayname'])
    config.set('id', twitchInfo['id'])
    config.set('pfp', twitchInfo['pfp'])
    
    badgeManager.refreshBadges(twitchInfo['id']);

    if(mainWindow){
        mainWindow.webContents.send("update-channel-displays", [twitchInfo['pfp'], twitchInfo['displayname']])
    }

    // disconnects twitch bot
    twitch.disconnect()
    
    // clears chat
    chatWindow.webContents.executeJavaScript(`document.getElementById('chat-box').innerHTML = ""`)

    // connects to new channel
    twitch.connect(channel)
  })


  ipcMain.handle('connect-twitch', async function(event){
    channel = config.get('channel', 'xQcOW')
    // console.log(`ipcMain Handler: connect-twitch => Channel: '${channel}'`)
    twitch.connect(channel)
  })

ipcMain.handle('chat-window', async function(event, data){
    console.log(`ipcMain recieved 'chat-window' : ${data}`)
    if(data == 'lock'){
        lock()
    }

    if(data == 'unlock')
        unlock()

    if(!config.get('window.chat.locked')){
        unlock()
    }
})