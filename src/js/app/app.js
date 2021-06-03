const { windowsStore } = require('process')
var config = require('electron-json-config')
window.$ = window.jquery = require('jquery')
var font = require('./js/app/font.js')
var channel = require('./js/app/channel.js')
var titlebar = require('./js/app/titlebar.js')
var winChat = require('./js/chat/window.js')
var info = require('./js/app/info.js')


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
$('#toggle-chat').on('click', function(){

    if(!$(this).data('opened')){
        winChat.open(debug)
        font.setWin(winChat.getWin())
        config.set('window.chat.opened', true)
        
        $(this).removeClass('overlay-closed')
        $(this).addClass('overlay-opened')
        $(this).data('opened', true)
    } else {
        
        winChat.close()
        config.set('window.chat.opened', false)
        
        $(this).removeClass('overlay-opened')
        $(this).addClass('overlay-closed')
        $(this).data('opened', false)

    }

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
$('#toggle-lock').on('click', function(){

    if(!$(this).data('locked')){
        console.log('locking')
        if(winChat) winChat.lock()
        config.set('window.chat.locked', true)
        
        $(this).removeClass('bi-unlock')
        $(this).addClass('bi-lock')
        $(this).data('locked', true)
        return
    } else {
        console.log('unlocking')
        if(winChat) winChat.unlock()
        config.set('window.chat.locked', false)
        
        $(this).removeClass('bi-lock')
        $(this).addClass('bi-unlock')
        $(this).data('locked', false)
        return
    }
})