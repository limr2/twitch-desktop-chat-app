const { windowsStore } = require('process')
var config = require('electron-json-config')
window.$ = window.jquery = require('jquery')
var font = require('./js/app/font.js')
var channel = require('./js/app/channel.js')
var titlebar = require('./js/app/titlebar.js')
var winChat = require('./js/chat/window.js')


var opened = null
var locked = null

var debug = false

// runs when app starts
$(function(){

    loadConfig()

})

// reads data from config
function loadConfig() {

    locked = config.get('window.chat.locked', false)

    setPersistedsettings()
}

// populates persisted settings to app interface 
function setPersistedsettings() {
    
}

// toggle resizing and moving chat window
$('#toggle-lock').on('click', function(){

    if(!$(this).data('locked')){
        console.log('locking')
        if(winChat) winChat.lock()
        config.set('window.chat.locked', true)
        
        $(this).removeClass('unlocked')
        $(this).addClass('locked')
        $(this).data('locked', true)
        return
    } else {
        console.log('unlocking')
        if(winChat) winChat.unlock()
        config.set('window.chat.locked', false)
        
        $(this).removeClass('locked')
        $(this).addClass('unlocked')
        $(this).data('locked', false)
        return
    }
})