const { windowsStore } = require('process')
var config = require('electron-json-config')
window.$ = window.jquery = require('jquery')
var chatDocument = require('./js/chat.js')
var winChat = null;

// toggle opening/closing chat window
$('#toggle-chat').on('change', function(){
    if(this.checked){
        if($('#toggle-debug').prop('checked')){
            openDebugChat()
        } else {
            openChat()
        }
        return
    } 
    console.log("Closing Chat...")
    closeChat()

});

// toggle resizing and moving chat window
$('#toggle-lock').on('change', function(){
    if(this.checked){
        console.log('Locking Chat Window...')
        if(winChat) winChat.setIgnoreMouseEvents(true)
        if(winChat) winChat.webContents.executeJavaScript(`document.getElementById('chat-body').classList.remove('frame')`)
        config.set('locked', true)
        return
    } 
    console.log('Unlocking Chat Window...')
    if(winChat) winChat.setIgnoreMouseEvents(false)
    if(winChat) winChat.webContents.executeJavaScript(`document.getElementById('chat-body').classList.add('frame')`)
    config.set('locked', false)
});

$('#font-size-slider').on('input', function(){
    size = $('#font-size-slider').val()
    changeFontSize(size)
    $('#font-size-text').val(size)
})

$('#font-size-text').on('change', function(){
    size = $('#font-size-text').val()
    changeFontSize(size)
    $('#font-size-slider').val(size)
})

function changeFontSize(size){
    console.log('Changing Font Size to ' + size + 'px...')
    $('.chat-text-example').css('font-size', size + 'px')
    config.set('font-size', size)
    if(winChat) winChat.webContents.executeJavaScript(`
        document.getElementById('chat-box').style['font-size'] = ${size} + 'px';
  `)
    console.log(config.get('font-size') + 'px')
}

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

function changeOpacity(opacity){
    console.log('Changing Opacity to ' + opacity + '...')
    $('.chat-text-example').css('opacity', opacity)
    config.set('opacity', opacity)
    if(winChat) winChat.webContents.executeJavaScript(`
        document.getElementById('chat-box').style['opacity'] = ${opacity};
  `)
}

$('#font-color').on('input', function(){
    color = $('#font-color').val()
    changeColor(color)
})

function changeColor(color){
    console.log('Changing Color to ' + color + '...')
    $('.chat-text-example').css('color', color)
    $('.chat-username').css('color', '#a7499c')
    config.set('color', color)
    if(winChat) winChat.webContents.executeJavaScript(`
        document.getElementById('chat-box').style['color'] = '${color}';
  `)

}

$('#btn-update-channel').on('click', function(){
    var channelName = $('#channelname').val()

    if(channelName) {
        config.set('channel', channelName)
    }
})

// opens chat window
function openChat() {
    channelName = config.get('channel')

    if(!channelName){
        alert('No channel selected')
        return
    }

    console.log("Opening " + channelName  + "'s Chat...")

    const remote = require('electron').remote;
    const path = require('path')
    const BrowserWindow = remote.BrowserWindow;
    var w = parseInt(config.get('chat-width'))
    var h = parseInt(config.get('chat-height'))

    winChat = new BrowserWindow({
        width: w,
        height: h,
        minWidth: 200,
        minHeight:200,
        transparent: true,
        frame: false,
        webPreferences: {
           nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
  
    winChat.setAlwaysOnTop(true, 'screen');

    // and load the index.html of the app.

    var x = parseInt(config.get('chat-x'))
    var y = parseInt(config.get('chat-y'))

    winChat.setPosition(x,y)
    winChat.loadFile(path.join(__dirname, 'chat.html'));
    if(config.get('locked')) {
        winChat.setIgnoreMouseEvents(true)
        winChat.webContents.executeJavaScript(`document.getElementById('chat-body').classList.remove('frame')`)
    } 

    winChat.webContents.executeJavaScript(`readChat()`)

    winChat.on('move', function(){
        updateWinPos()
    })

    winChat.on('resize', function(){
        updateWinPos()
    })
}

// closes chat window
function closeChat(){
    winChat.close();
    winChat = null;
}

loadConfig()

function loadConfig(){
    console.log('Loading Config...')
    if(config.get('channel')){
        $('#channelname').val(config.get('channel'))
    }

    if(config.get('font-size')){
        size = config.get('font-size')
        changeFontSize(size)
        $('#font-size-text').val(size)
        $('#font-size-slider').val(size)
    }

    if(config.get('opacity')){
        opacity = config.get('opacity')
        changeOpacity(opacity)
        $('#opacity-text').val(opacity)
        $('#opacity-slider').val(opacity)
    }

    if(config.get('color')){
        color = config.get('color')
        changeColor(color)
        $('#font-color').val(color)
    }

    if(config.get('locked')){
        $('#toggle-lock').prop('checked', true)
    }

    if(config.get('chat-x')){
        $('#chat-x').val(config.get('chat-x'))
    }

    if(config.get('chat-y')){
        $('#chat-y').val(config.get('chat-y'))
    }

    if(config.get('chat-width')){
        $('#chat-width').val(config.get('chat-width'))
    }

    if(config.get('chat-height')){
        $('#chat-height').val(config.get('chat-height'))
    }

    if(config.get('idle-time')){
        //    
    }
}

function updateWinPos(){
    if(!winChat) return
    bounds = winChat.getBounds()

    $('#chat-x').val(bounds.x)
    config.set('chat-x', bounds.x)

    $('#chat-y').val(bounds.y)
    config.set('chat-y', bounds.y)

    $('#chat-width').val(bounds.width)
    config.set('chat-width', bounds.width)

    $('#chat-height').val(bounds.height)
    config.set('chat-height', bounds.height)

}