var channelName = null

var winChat = null

// runs on initialization
$(function(){
    loadConfig()
    listenChanges()
})

const setWin = (win) => {
    winChat = win
}

module.exports.setWin = setWin

// reads font data from config
function loadConfig() {
    channelName = config.get('channel', null)
    setPersistedSettings()
}

// populates persisted settings to app interface
function setPersistedSettings() {
    $('#channelname').val(channelName)
}

// saves current instance's channel to config
const saveConfig = () => {

    config.set('channel', channelName)

}

module.exports.saveConfig = saveConfig

const listenChanges = () => {

    // Updates when typing in channel input 
    $('#channelname').on('input', function(){
        channelName = $('#channelname').val()
    })

    // Saves to config when button pressed
    $('#btn-update-channel').on('click', function(){
        saveConfig()
    })
} 

module.exports.listenChanges = listenChanges