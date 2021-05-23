var channelName = null

// runs on initialization
$(function(){
    loadConfig()
    listenChanges()
})

// reads font data from config
function loadConfig() {
    msg = `Loading Channel:`
    channelName = config.get('channel', null)
    msg += `\n - Name: ${channelName}`
    console.log(msg)
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

function listenChanges(){

    // Updates when typing in channel input 
    $('#channelname').on('input', function(){
        channelName = $('#channelname').val()
    })

    // Saves to config when button pressed
    $('#btn-update-channel').on('click', function(){
        saveConfig()
    })
}

const name = () => {
    return channelName
}

module.exports.name = name