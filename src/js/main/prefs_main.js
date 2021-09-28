const { ipcMain } = require("electron")
var config = require('electron-json-config');

ipcMain.handle('get-prefs', function(){
    let overlaySettings = {
        font_size: config.get('chat.font-size', 18),
        opacity: config.get('chat.opacity', 1),
        fade_delay: config.get('chat.fade-delay', 15),
        channel: config.get('channel', 'saltyteemo'),
        locked: config.get('window.chat.locked', false),
    }
    return overlaySettings
})
  
ipcMain.handle('update-chat-pref', async function(event, pref, data) {
    config.set(`chat.${pref}`, data)
    // console.log(`'${pref}' set to '${data}'`)

    //TODO:  send this to chat renderer
    return 1
  })