var timer = require('timer-stopwatch')

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
    time = parseInt(config.get('idle.time', 10))*100000
}

// initializes the timer
function init() {   
    idleTimer = new timer(time)
    idleTimer.onDone(function(){
        $('.chat-text').fadeOut()
    })
}

// starts idle timer
const start = () => {
    if(enabled){
        idleTimer.start()
    }
}

module.exports.start = start

// resets idle timer
const reset = () => {
    if(enabled){
        idleTimer.reset(time)
        idleTimer.start()
    }
    $('.chat-text').fadeIn()
}

module.exports.reset = reset

const pause = () => {
    idleTimer.pause()
}

module.exports.pause = pause

const stop = () => {
    idleTimer.stop()
}

module.exports.stop = stop