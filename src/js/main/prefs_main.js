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


var chatWindow = require('./chatWindow_main.js')

ipcMain.handle('update-chat-pref', async function(event, pref, data) {
    config.set(`chat.${pref}`, data)

    //TODO:  send this to chat renderer
    if(pref == 'font-size' || pref == 'opacity')
        chatWindow.updateChannelText(pref, data)
    if(pref == 'fade-delay'){
        console.log(`updating fade delay: ${data}`)
        config.set('idle.time', data)
        chatWindow.updateFadeoutDelay(data)
    }
    return 1
  })
