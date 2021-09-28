const { ipcRenderer } = require('electron')

const shell = require('electron').shell;

window.$ = window.jquery = require('jquery')


var titlebar = require('./js/app/titlebar.js')

var settings = require('./js/app/settings.js')



// Executes when DOM is finished loading
$(function(){

    handleAuthorsLink()

})

// opens author links externally (default browser)
const handleAuthorsLink = () => {

    $(document).on('click', 'a[href^="https"]', function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
});
}
