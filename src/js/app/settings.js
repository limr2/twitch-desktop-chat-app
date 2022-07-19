const { ipcRenderer, ipcMain } = require("electron")
var config = require('electron-json-config');

const options = {
    NONE: 'undefined',
    FONT_SIZE: 'font-size',
    OPACITY: 'opacity',
    FADE_DELAY: 'fade-delay',
}

var channel, fontSize, opacity, fadeDelay


$(async function(){
    var result = await ipcRenderer.invoke('update-channel', config.get('channel', 'xQcOW'))

    loadPrefs()

    handleChannelInput()
    handleFadeDelayInput()
    handleFontSizeInput()
    handleOpacityInput()
    handleOverlayLock()
})

function updateExampleText(){
    $('.chat-text-example').css('font-size', fontSize + 'px')
    $('.chat-text-example').css('opacity', opacity)
}

async function loadPrefs(){

    // gets preferences from main process
    prefs = await ipcRenderer.invoke('get-prefs')

    // stores preferences locally
    fontSize = prefs['font_size']
    opacity = prefs['opacity']
    fadeDelay = prefs['fade_delay']
    // color = prefs['color'] 
    channel = prefs['channel']
    locked = prefs['locked']

    // updates the input slider/text to loaded preferences
    $('#font-size-slider').val(fontSize)
    $('#font-size-text').val(fontSize)

    $('#opacity-slider').val(opacity)
    $('#opacity-text').val(opacity)

    $('#fade-delay-slider').val(fadeDelay)
    $('#fade-delay-text').val(fadeDelay)

    updateExampleText()

    $('#channelname').val(channel)
    // $('#example-channelname').html(`${channel} `)

    console.log(`>>> Locked: ${locked}`)
    if(locked){
        $('#toggle-lock').addClass('locked')
        await ipcRenderer.invoke('chat-window', 'lock')
        console.log('>>> sent lock')
    } else {        
        await ipcRenderer.invoke('chat-window', 'unlock')
        console.log('>>> sent unlock')
    }

    

}

async function handleChannelInput(){

    $("#channelname").on('keyup', function(event) {
        if(event.key == 'Enter'){
            $('#btn-update-channel').trigger('click')
        }
    })
    $('#btn-update-channel').on('click', async function(){

        channel = $('#channelname').val()

        var result = await ipcRenderer.invoke('update-channel', channel)
        if(result = 1){
            $(':focus').trigger('blur')
        }
    })
}

async function handleFontSizeInput() {
    
    $('#font-size-slider').on('input', async function () {
        fontSize = $(this).val();
        $('#font-size-text').val(fontSize);

        var result = await ipcRenderer.invoke('update-chat-pref', options.FONT_SIZE, fontSize);
        if(result = 1){
            updateExampleText()
        }
    })

    $('#font-size-text').on('input', async function(){
        fontSize = $(this).val()
        $('#font-size-slider').val(fontSize)
        var result = await ipcRenderer.invoke('update-chat-pref', options.FONT_SIZE, fontSize);
        if(result = 1){
            updateExampleText()
        }
    })

}

async function handleOpacityInput() {
    
    $('#opacity-slider').on('input', async function(){
        opacity = $(this).val()
        $('#opacity-text').val(opacity)
        var result = await ipcRenderer.invoke('update-chat-pref', options.OPACITY, opacity);
        if(result = 1){
            updateExampleText()
        }
    })

    $('#opacity-text').on('input', async function(){
        rawOpacity = $(this).val()
        $('#opacity-slider').val(opacity)
        var result = await ipcRenderer.invoke('update-chat-pref', options.OPACITY, opacity);
        if(result = 1){
            updateExampleText()
        }
    })

}

async function handleFadeDelayInput() {
    
    $('#fade-delay-slider').on('input', async function(){
        fadeDelay = $(this).val()
        $('#fade-delay-text').val(fadeDelay)
        await ipcRenderer.invoke('update-chat-pref', options.FADE_DELAY, fadeDelay);
    })

    $('#fade-delay-text').on('input', async function(){
        fadeDelay = $(this).val()
        $('#fade-delay-slider').val(fadeDelay)
        await ipcRenderer.invoke('update-chat-pref', options.FADE_DELAY, fadeDelay);
    })
}

async function handleOverlayLock(){

    $('#toggle-lock').on('click', async function(){
        console.log('>>> clicked toggle lock')

        $('#toggle-lock').toggleClass(['locked']);
        let bool = $('#toggle-lock').hasClass('locked')
        console.log(`Pressed Lock: ${bool}`)
        // overwolf.windows.sendMessage('background', 'toggle-lock', bool, res => {})
        var result = await ipcRenderer.invoke('chat-window', bool ? 'lock': 'unlock')

        // if(!$(this).data('locked')){
        //     console.log('>>> locking')
        //     var result = await ipcRenderer.invoke('chat-window', 'lock')
        //     if(result = 1){
        //         $(this).removeClass('unlocked')
        //         $(this).addClass('locked')
        //         $(this).data('locked', true)
        //         $(this).html('unlock overlay&nbsp;&nbsp;<span class=bi-fullscreen>')
        //     }
        //     return
        // } else {
        //     console.log('>>> unlocking')
        //     var result = await ipcRenderer.invoke('chat-window', 'unlock')
        //     if(result = 1){
        //         $(this).removeClass('locked')
        //         $(this).addClass('unlocked')
        //         $(this).data('locked', false)
        //         $(this).html('lock overlay&nbsp;&nbsp;<span class=bi-fullscreen>')
        //     }
        //     return
        // }
    })
}

ipcRenderer.on("update-channel-displays", function(event, data){    
    $('.pfp').attr("src", `${data[0]}`)
    $('#example-channelname').html(`${data[1]}`)
})