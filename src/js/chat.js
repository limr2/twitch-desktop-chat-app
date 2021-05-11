var tmi = require('tmi.js');
window.$ = window.jquery = require('jquery')

// Define configuration options
const opts = {
    identity: {
        username: 'roseiol',
        password: 'oauth:99ie9cyt71r4r36kqdzk32k3oxx7du'
    },
    channels: ['roselol']
};
// Create a client with our options
const client = new tmi.client(opts);
 
// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
 
// Connect to Twitch:
client.connect();
 
// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    updateChat(msg, context)
}
 
 // Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}

// Updates the chat display
function updateChat(msg, context){
    var newLine = document.createElement('li');
    newLine.classList.add('line');
    newLine.innerText = context['display-name'] + ": " + msg;
    $('#chat-box').append(newLine)
    $('#chat-box').animate({scrollTop: $('#chat-box').get(0).scrollHeight}, 0)

    if($("#chat-box li").length > 5){
        $('#chat-box li').first().remove();
    }
}