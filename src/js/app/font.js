var size = null
var color = null
var opacity = null

var win = null

// loads config on bootup

$(function(){
    loadConfig()
    listenChanges()
})

const setWin = (winChat) => {
    win = winChat
}

module.exports.setWin = setWin

// reads font data from config
function loadConfig() {
    msg = `Loading Font:`

    size = parseInt(config.get('font.size', 20))
    msg += `\n - Size: ${size}px`

    color = config.get('font.color', '#ffffff')

    msg += `\n - Color: ${color}`

    opacity = parseFloat(config.get('font.opacity', 1))
    msg += `\n - Opacity: ${opacity*100}%`
    console.log(msg)
    setPersistedSettings()
}

// populates persisted settings to app interface 
function setPersistedSettings() {

    // font size
    $('#font-size-slider').val(size)
    $('#font-size-text').val(size)
    $('.chat-text-example').css('font-size', size + 'px')

    // font opacity
    $('#opacity-slider').val(opacity)
    $('#opacity-text').val(opacity)
    $('.chat-text-example').css('opacity', opacity)

    // font color
    $('#font-color').val(color)
    updateColor()

}

// saves current instance's font settings to config
const saveConfig = () => {
    config.set('font.size', size)
    config.set('font.color', color)
    config.set('font.opacity', opacity)
}

module.exports.saveConfig = saveConfig

const listenColor = () => {

    $('#font-color').on('input', function(){
        color = $('#font-color').val()
        updateColor()
    })

}

module.exports.listenColor = listenColor

function updateColor() {

    $('.chat-text-example').css('color', color)
    $('.chat-username').css('color', '#a7499c')
    saveConfig()
    if(win) 
        win.webContents.executeJavaScript(`
            document.getElementById('chat-box').style['color'] = '${color}';
            idle.reset();
        `)

}

const listenSize = () => {
    
    $('#font-size-slider').on('input', function(){
        size = $('#font-size-slider').val()
        updateSize()
        $('#font-size-text').val(size)
    })
    
    $('#font-size-text').on('change', function(){
        size = $('#font-size-text').val()
        updateSize()
        $('#font-size-slider').val(size)
    })

}

module.exports.listenSize = listenSize

function updateSize(){

    $('.chat-text-example').css('font-size', size + 'px')
    saveConfig()
    if(win) 
        win.webContents.executeJavaScript(`
            document.getElementById('chat-box').style['font-size'] = ${size} + 'px';
            idle.reset();
        `)

}

const listenOpacity = () => {

    $('#opacity-slider').on('input', function(){
        opacity = $('#opacity-slider').val()
        changeOpacity(opacity)
        $('#opacity-text').val(opacity)
    })
    
    $('#opacity-text').on('change', function(){
        opacity = $('#opacity-text').val()
        changeOpacity(opacity)
        $('#opacity-slider').val(opacity)
    })

}

module.exports.listenOpacity = listenOpacity

function changeOpacity(opacity){

    $('.chat-text-example').css('opacity', opacity)
    saveConfig()
    if(win) 
        win.webContents.executeJavaScript(`
            document.getElementById('chat-box').style['opacity'] = ${opacity};
            idle.reset();
        `)

}

const listenChanges = () => {

    listenColor()
    listenOpacity()
    listenSize()

}

module.exports.listenChanges = listenChanges