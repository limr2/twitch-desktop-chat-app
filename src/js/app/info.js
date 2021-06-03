var electron = require('electron');
var appWindow = electron.remote.getCurrentWindow();

window.$ = window.jquery = require('jquery')

$(function(){
    listenEvents()
})

function listenEvents(){
    $('#btn-devtools').on('click', function(){
        appWindow.webContents.openDevTools()
    })
}