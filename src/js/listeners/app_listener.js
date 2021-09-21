const { ipcRenderer } = require('electron')

window.$ = window.jquery = require('jquery')
ipcRenderer

const options = {
    NONE: 'undefined',
    FONT_SIZE: 'font-size',
    OPACITY: 'opacity',
    FADEOUT_TIME: 'fadeout-time',
}

// Executes when DOM is finished loading
$(function(){

    listenFontSize()
    listenOpacity()

})

const listenFontSize = () => {
    
    $('#font-size-slider').on('input', function(){
        rawFontSize = $(this).val()
        $('#font-size-text').val(rawFontSize)
        ipcRenderer.send('update', options.FONT_SIZE, rawFontSize)
    })

    $('#font-size-text').on('input', function(){
        rawFontSize = $(this).val()
        $('#font-size-slider').val(rawFontSize)
        ipcRenderer.send('update', options.FONT_SIZE, rawFontSize)
    })

}

const listenOpacity = () => {
    
    $('#opacity-slider').on('input', function(){
        rawOpacity = $(this).val()
        $('#font-size-text').val(rawOpacity)
        ipcRenderer.send('update', options.OPACITY, rawOpacity)
    })

    $('#opacity-text').on('input', function(){
        rawOpacity = $(this).val()
        $('#opacity-slider').val(rawOpacity)
        ipcRenderer.send('update', options.OPACITY, rawOpacity)
    })

}

