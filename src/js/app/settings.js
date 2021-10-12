const options = {
    NONE: 'undefined',
    FONT_SIZE: 'font-size',
    OPACITY: 'opacity',
    FADE_DELAY: 'fade-delay',
}

var channel, fontSize, opacity, fadeDelay


$(function(){

    loadPrefs()

    handleChannelInput()
    handleFadeDelayInput()
    handleFontSizeInput()
    handleOpacityInput()
    handleOverlayLock()
})



function updateChannelText(){
    //TODO: Update PFP of channel

    $('#example-channelname').html(`${channel} `)

}

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
    $('#example-channelname').html(`${channel} `)

    if(locked){
        $('#toggle-lock').addClass('locked')
        $(this).data('locked', true)
    } else {        
        $('#toggle-lock').addClass('unlocked')
        $(this).data('locked', false)
    }

}

async function handleChannelInput(){

    $('#btn-update-channel').on('click', async function(){

        channel = $('#channelname').val()

        var result = await ipcRenderer.invoke('update-channel', channel)
        if(result = 1){
            $(':focus').trigger('blur')
            updateChannelText()
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
        console.log('clicked toggle lock')
        if(!$(this).data('locked')){
            console.log('locking')
            var result = await ipcRenderer.invoke('chat-window', 'lock')
            if(result = 1){
                $(this).removeClass('unlocked')
                $(this).addClass('locked')
                $(this).data('locked', true)
            }
            return
        } else {
            console.log('unlocking')
            var result = await ipcRenderer.invoke('chat-window', 'unlock')
            if(result = 1){
                $(this).removeClass('locked')
                $(this).addClass('unlocked')
                $(this).data('locked', false)
            }
            return
        }
    })
}