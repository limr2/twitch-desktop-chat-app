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
function saveConfig() {

    config.set('channel', channelName)

}

function listenChanges(){

    // Updates when typing in channel input 
    $('#channelname').on('input', function(){
        channelName = $('#channelname').val()
    })

    // Saves to config when button pressed
    $('#btn-update-channel').on('click', function(){
        saveConfig()
        if(!winChat) return

        winChat.close()

        // TODO:
        // update pfp
        // clear and relaunch chat
    })
}

const name = () => {
    return channelName
}

module.exports.name = name