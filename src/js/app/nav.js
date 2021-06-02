window.$ = window.jquery = require('jquery')

var current = 'main'
var menu = null

// init
$(function(){
    open(current)
})

$('nav').on('click', function(event){
    if($(event.target).is('div')) {
        return
    }
    menu = event.target.id.split('-')[1]
    console.log(menu)
    open(menu)
})


function open(menu){
    close(current)
    console.log('Opening: ' + menu)
    $('.animation').addClass('selected-' + menu)
    $('#menu-' + menu).addClass('opened-menu')
    current = menu
}

function close(menu){
    console.log('Closing: ' + menu)
    $('.animation').removeClass('selected-' + current)
    $('#menu-' + menu).removeClass('opened-menu')
}