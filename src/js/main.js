const { windowsStore } = require('process')

window.$ = window.jquery = require('jquery')

var win = null;

$('#btn-open-chat').on('click', openChat())

function openChat() {
    console.log('Opening Chat...')

    if(win){
        console.log('Already opened')
        win.close();
    }

    const remote = require('electron').remote;
    const path = require('path')
    const BrowserWindow = remote.BrowserWindow;
    
    win = new BrowserWindow({
        width: 800,
        height: 500,
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
    win.setPosition(0,0)
    win.loadFile(path.join(__dirname, 'chat.html'));
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
