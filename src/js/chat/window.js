win = null;

winX = null
winY = null
winW = null
winH = null
locked = null
winBounds = null
channel = null

//
$(function(){
    loadConfig()
    setPersistedSettings()
})

const loadConfig = () =>{

    msg = `Loading Chat Window:`

    channel = config.get('channel', null)
    msg += `\n- Channel: ${channel}`

    opened = config.get('window.chat.opened', false)
    msg += `\n- Opened: ${opened}`

    winBounds = config.get('window.chat.bounds', {x: 25, y: 25, width: 400, height: 600})
    msg += `\n- Bounds: ${winBounds}`
    
    locked = config.get('window.chat.locked', false)
    msg += `\n- Locked: ${locked}`

    debug = config.get('window.chat.debug', false)
    msg += `\n- Debug: ${debug}`
    
    console.log(msg)
}

module.exports.loadConfig = loadConfig

function setPersistedSettings() {
    if(opened) {
        $('#toggle-chat').prop('checked', true)
        winChat.open(debug)
        font.setWin(winChat.getWin())
    }

    if(!locked) {
        $('#toggle-lock').prop('checked', true)
        winChat.unlock()
    }

    if(debug) {
        $('#toggle-debug').prop('checked', true)
    }
}


// saves data to config
const saveConfig = () => {
    
    // sets data to config
    config.set('window.chat.locked', locked)
    channel = config.set('channel', channel)

}

module.exports.saveConfig = saveConfig

// opens chat window
const open = (debug) => {

    // makes sure settings are up to date
    loadConfig()

    var t = true
    var f = false
    
    // if debug enabled, window will open with a frame and wont be transparent
    if(debug) {
        t = false
        f = true
    } 

    // cancels if no channel selected
    if(!channel){
        alert('Please specify a channel')
        $('#toggle-chat').prop('checked', false)
        config.set('window.chat.opened', false)
        // TODO --
        // code to focus/highlight the channel input
        return
    }

    console.log("Opening " + channel  + "'s Chat...")

    // creates electron browser window
    const remote = require('electron').remote;
    const path = require('path')
    const BrowserWindow = remote.BrowserWindow;

    win = new BrowserWindow({
        minWidth: 200,
        minHeight: 200,
        transparent: t,
        frame: f,
        webPreferences: {
           nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
    
    // opens dev tools if in debug mode
    if(debug) win.webContents.openDevTools();

    // forces window to always be in front
    win.setAlwaysOnTop(true, 'screen');
    
    // sets window position/size from previous instance
    win.setBounds(winBounds)

    // loads html file
    win.loadFile(path.join(__dirname, '../../chat.html'));

    // locks window if previously locked
    if(locked) {
        lock()
    } 

    // remembers window position and size after moving
    win.on('move', function(){
        saveWinBounds()
    })

    // remembers window position and size after resize
    win.on('resize', function(){
        saveWinBounds()
    })

    // remmembers window position and size when closing, and disconnects the chat bot
    win.on('before-quit', function(){
        saveWinBounds()

        // disconnects the twitch bot
        if(win) win.webContents.executeJavaScript(`twitch.disconnect()`)
    })
}

module.exports.open = open

// locks the chat window
const lock = () => {
    
    // disables user interaction with chat window (can click thru)
    win.setIgnoreMouseEvents(true)
   
    // hides the border
    win.webContents.executeJavaScript(`document.getElementById('chat-body').classList.remove('frame')`)
   
    // updates config
    config.set('window.chat.locked', true)
}

module.exports.lock = lock

// unlocks the chat window
const unlock = () => {

    // enables user interaction with chat window (can move/resize)
    win.setIgnoreMouseEvents(false)

    // shows the border
    win.webContents.executeJavaScript(`document.getElementById('chat-body').classList.add('frame')`)
    
    // updates config
    config.set('window.chat.locked', false)
}

module.exports.unlock = unlock

// function to save window pos/size to config
const saveWinBounds = () => {
    if(!win) return
    winBounds = win.getBounds()
    config.set('window.chat.bounds', winBounds)
}

module.exports.saveWinBounds = saveWinBounds

// closes chat window
const  close = () => {
    if(win)
        win.close();
    win = null;
}

module.exports.close = close

// returns window object (lets other classes interact with chat window)
const getWin = () => {
    return win
}

module.exports.getWin = getWin
