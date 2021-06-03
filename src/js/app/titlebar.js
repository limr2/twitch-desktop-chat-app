var electron = require('electron');
var appWindow = electron.remote.getCurrentWindow();

$(function(){
    console.log('title bar running!')
    listenTitleBar()  
})

function close(){
  if(!appWindow) return
  // TODO:
  //    doublecheck user wants to close?
  appWindow.close()
}

function minimize(){
    if(!appWindow) return
    // TODO:
    //    hault resource intensive tasks
    appWindow.minimize()
}

function toggleFullscreen(){
    if(!appWindow) return

    if(appWindow.isMaximized()) {
        appWindow.unmaximize()
    } else {
        appWindow.maximize()
    }
    
    
}

function listenTitleBar(){
    $('#title-min').on('click', function(){
        minimize()
    })

    $('#title-full').on('click', function(){
        toggleFullscreen()
    })
  
    $('#title-close').on('click', function(){
        close()
    })
}