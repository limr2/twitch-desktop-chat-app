const { ipcRenderer } = require("electron")

$(function(){
    handleTitleBar()
})

async function handleTitleBar(){
    $('#title-min').on('click', async function(){
        await ipcRenderer.invoke('minimize-app-window')
    })
  
    $('#title-close').on('click', async function(){
        await ipcRenderer.invoke('close-app-window')
    })
}