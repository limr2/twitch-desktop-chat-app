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
    chatDocument.showBorder()
    config.set('locked', false)

    console.log(winChat.webContents)

});

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
    var w = parseInt($('#chat-width').val())
    var h = parseInt($('#chat-height').val())

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

    var x = parseInt($('#chat-x').val())
    var y = parseInt($('#chat-y').val())

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

// syncronize font slider and text input
function updateFontAmount(){
    var slider = $('#range-max-ram').val()
    $('#amount-max-ram').val(slider)
}
function updateFontRange(){
    var amount = $('#amount-max-ram').val()
    $('#range-max-ram').val(amount)
}

$('#btnClick').on('click', function(){ 
    updateWinPos()
});

loadConfig()

function loadConfig(){
    console.log('Loading Config...')
    if(config.get('channel')){
        $('#channelname').val(config.get('channel'))
    }

    if(config.get('font-size')){
        // update font size
    }

    if(config.get('opacity')){
        // update opacity
    }

    if(config.get('locked')){
        console.log('locked')
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