window.$ = window.jquery = require('jquery')

var current = 'main'
var menu = null

// init
$(function(){
    open(current)
})

$('.nav').on('click', function(){
    menu = this.id.split('-')[1]
    open(menu)
})


function open(menu){
    close(current)
    console.log('Opening: ' + menu)
    $('#nav-' + menu).addClass('selected-nav')
    $('#menu-' + menu).addClass('opened-menu')
    current = menu
}

function close(menu){
    console.log('Closing: ' + menu)
    $('#nav-' + menu).removeClass('selected-nav')
    $('#menu-' + menu).removeClass('opened-menu')
}