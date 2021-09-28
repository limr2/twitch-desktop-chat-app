const { ipcMain } = require("electron");
var config = require('electron-json-config');

ipcMain.handle('chat-window', function(event, data){
    if(data = 'locked'){
        //TODO: lock window

        config.set('window.chat.locked', true)


        return 1;
    }

    if(data = 'unlock'){
        //TODO: unlock window
        config.set('window.chat.locked', false)
        return 1;
    }

    return 0;

})

const addLine = (badges, username, message) => {

}

module.exports.addLine = addLine

const fade = () => {

}

module.exports.fade = fade