var timer = require('timer-stopwatch')
var config = require('electron-json-config');
const { ipcRenderer } = require('electron');

// class variables
var enabled = false
var time = null;
var idleTimer = null;

// executes when DOM is finished loaded
$(function(){
    loadConfig()
    init()
})

// gets persisted settings from config
function loadConfig(){
    
    enabled = config.get('idle.enabled', true)
    // idle.time saved in seconds, need x1000 because idle timer in miliseconds
    time = parseInt(config.get('idle.time', 15))
    console.log(`>>> idle.js: loadConfig() => time: ${time}`)
    
}

ipcRenderer.on('update-fadeout-delay', function(event, newDelay){
    time = newDelay
    idleTimer.reset(time*1000)
    reset()
})

// initializes the timer
function init() {   
    console.log(`>>> idle.js: init()`)
    
    var options = {
        refreshRateMS: 1000
    }
    
    idleTimer = new timer(time*1000, options)
    // idleTimer.onTime(function(time){
    //     console.log(`Time Left: ${time.ms}`)
    // })
    idleTimer.onDone(function(){
        console.log(`>>> idle.js: init() => Fading out`)
        if(time != 0)
            $('.chat-text').fadeOut()
    })
}

// starts idle timer
const start = () => {
    console.log(`>>> idle.js: start() => enabled: ${enabled}`)

    if(enabled){
        idleTimer.start()
    }
}

module.exports.start = start

// resets idle timer
const reset = () => {
    // console.log(`idle.js: reset() => enabled: ${enabled}`)
    if(enabled){
        idleTimer.reset()
        idleTimer.start()
    }
    $('.chat-text').fadeIn()
}

module.exports.reset = reset

const pause = () => {
    console.log(`>>> idle.js: pause()`)
    idleTimer.pause()
}

module.exports.pause = pause

const stop = () => {
    console.log(`>>> idle.js: stop()`)
    idleTimer.stop()
}

module.exports.stop = stop