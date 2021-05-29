const { windowsStore } = require('process')
var config = require('electron-json-config')
window.$ = window.jquery = require('jquery')
var font = require('./js/app/font.js')
var channel = require('./js/app/channel.js')
var winChat = require('./js/chat/window')


var opened = null
var locked = null

var debug = false

// runs when app starts
$(function(){

    loadConfig()

})

// reads data from config
function loadConfig() {

    opened = config.get('window.chat.opened', false)
    locked = config.get('window.chat.locked', false)

    setPersistedsettings()
}

// populates persisted settings to app interface 
function setPersistedsettings() {
    
}


// toggle opening/closing chat window
$('#toggle-chat').on('change', function(){
    if(this.checked){
        winChat.open(debug)
        font.setWin(winChat.getWin())
        config.set('window.chat.opened', true)
        return
    } 
    winChat.close()
    config.set('window.chat.opened', false)

});

$('#toggle-debug').on('change', function(){
    if(this.checked){
        config.set('window.chat.debug', true)
        console.log
        debug = true
        return
    }
    config.set('window.chat.debug', false)
    debug = false

});

// toggle resizing and moving chat window
$('#toggle-lock').on('change', function(){
    if(this.checked){
        winChat.lock()
        config.set('window.chat.locked', true)
        return
    } 
    winChat.unlock()
    config.set('window.chat.locked', false)
});


