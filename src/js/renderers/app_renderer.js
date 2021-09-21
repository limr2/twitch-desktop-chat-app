const { ipcRenderer } = require('electron')

const shell = require('electron').shell;

window.$ = window.jquery = require('jquery')

const options = {
    NONE: 'undefined',
    FONT_SIZE: 'font-size',
    OPACITY: 'opacity',
    FADE_DELAY: 'fade-delay',
}

// Executes when DOM is finished loading
$(function(){

    listenFontSize()
    listenOpacity()
    listenFadeDelay()
    listenAuthorsLink()

})

async function listenFontSize() {
    
    $('#font-size-slider').on('input', async function () {
        rawFontSize = $(this).val();
        $('#font-size-text').val(rawFontSize);
        const completed = await ipcRenderer.invoke('update', options.FONT_SIZE, rawFontSize);
        if(completed){
            updateExampleText()
        }
    })

    $('#font-size-text').on('input', function(){
        rawFontSize = $(this).val()
        $('#font-size-slider').val(rawFontSize)
        ipcRenderer.send('update', options.FONT_SIZE, rawFontSize)
    })


    // ipcRenderer.on('')

}

const listenOpacity = () => {
    
    $('#opacity-slider').on('input', function(){
        rawOpacity = $(this).val()
        $('#opacity-text').val(rawOpacity)
        ipcRenderer.send('update', options.OPACITY, rawOpacity)
    })

    $('#opacity-text').on('input', function(){
        rawOpacity = $(this).val()
        $('#opacity-slider').val(rawOpacity)
        ipcRenderer.send('update', options.OPACITY, rawOpacity)
    })

}

// 
async function listenFadeDelay() {
    
    $('#fade-delay-slider').on('input', function(){
        rawFadeDelay = $(this).val()
        $('#fade-delay-text').val(rawFadeDelay)
        ipcRenderer.send('update', options.FADEOUT_TIME, rawFadeDelay)
    })

    $('#fade-delay-text').on('input', function(){
        rawFadeDelay = $(this).val()
        $('#fade-delay-slider').val(rawFadeDelay)
        ipcRenderer.send('update', options.FADEOUT_TIME, rawFadeDelay)
    })

}

// opens author links externally (default browser)
const listenAuthorsLink = () => {

    $(document).on('click', 'a[href^="https"]', function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
});
}

