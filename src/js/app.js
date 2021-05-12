const { windowsStore } = require('process')

window.$ = window.jquery = require('jquery')

var win = null;

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


// opens chat window
function openChat() {
    console.log('Opening Chat...')

    const remote = require('electron').remote;
    const path = require('path')
    const BrowserWindow = remote.BrowserWindow;
    var w = parseInt($('#chat-width').val())
    var h = parseInt($('#chat-height').val())

    win = new BrowserWindow({
        width: w,
        height: h,
        transparent: true,
        frame: false,
        webPreferences: {
           nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
  
    win.setAlwaysOnTop(true, 'screen');
    win.setIgnoreMouseEvents(true)

    // and load the index.html of the app.

    var x = parseInt($('#chat-x').val())
    var y = parseInt($('#chat-y').val())
    console.log("x: " + x)
    console.log("y: " + y)

    win.setPosition(x,y)
    win.loadFile(path.join(__dirname, 'chat.html'));
}

function openDebugChat() {
    console.log('Opening Chat...')

    const remote = require('electron').remote;
    const path = require('path')
    const BrowserWindow = remote.BrowserWindow;

    
    var w = parseInt($('#chat-width').val())
    var h = parseInt($('#chat-height').val())
    
    win = new BrowserWindow({
        width: w,
        height: h,
        webPreferences: {
           nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    var x = parseInt($('#chat-x').val())
    var y = parseInt($('#chat-y').val())

    console.log("x: " + x)
    console.log("y: " + y)
    win.setPosition(x,y)
    win.loadFile(path.join(__dirname, 'chat.html'));
    win.webContents.openDevTools();
}

// closes chat window
function closeChat(){
    win.close();
    win = null;
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

win

function updateWinPos(){
    if(!win) return
    bounds = win.getBounds()
    $('#chat-x').val(bounds.x)
    $('#chat-y').val(bounds.y)
    $('#chat-width').val(bounds.width)
    $('#chat-height').val(bounds.height)

    console.log(bounds.x)

}