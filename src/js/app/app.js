const { windowsStore } = require('process')
var config = require('electron-json-config')
window.$ = window.jquery = require('jquery')
var font = require('./js/app/font.js')
var channel = require('./js/app/channel.js')
var winChat = require('./js/chat/window')

var debug = false

$(function(){
    // TODO --
    // check if chat was previously opened in last instance and auto-open chat if applicable
    // check if chat window was unlocked in last instance and auto-unlock if applicable
    //    probably have locked be init state, for cleaner animation (dont want to show border, then insta hide it if locked)
    //    ( this data is already save in config ['opened', 'locked'])
})

// toggle opening/closing chat window
$('#toggle-chat').on('change', function(){
    if(this.checked){
        winChat.open(debug)
        font.setWin(winChat.getWin())
        channel.setWin(winChat.getWin())
        config.set('opened', true)
        return
    } 
    winChat.close()
    config.set('opened', false)

});

$('#toggle-debug').on('change', function(){
    if(this.checked){
        console.log
        debug = true
        return
    }
    debug = false

});

// toggle resizing and moving chat window
$('#toggle-lock').on('change', function(){
    if(this.checked){
        winChat.lock()
        return
    } 
    winChat.unlock()
});


