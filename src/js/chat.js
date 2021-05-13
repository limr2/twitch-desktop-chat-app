var tmi = require('tmi.js');
window.$ = window.jquery = require('jquery')
var config = require('electron-json-config')


function readChat(){
    channelName = config.get('channel')
    if(!channelName) return
    console.log("Reading " + channelName + "'s chat...")
    // Define configuration options
    const opts = {
        identity: {
            username: 'roseiol',
            password: 'oauth:99ie9cyt71r4r36kqdzk32k3oxx7du'
        },
        channels: [channelName]
    };
    // Create a client with our options
    const client = new tmi.client(opts);
 
    // Register our event handlers (defined below)
    client.on('message', onMessageHandler);
    client.on('connected', onConnectedHandler);
 
    // Connect to Twitch:

    if(channelName) client.connect();
}

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

    console.log(context)

    var newLine = document.createElement('li');
    var username = document.createElement('span');
    var message = document.createElement('span');

    newLine.classList.add('line');
    username.classList.add('username');
    message.classList.add('message');

    username.style.color = context['color'];

    username.innerText = context['display-name'];
    message.innerText = msg;

    newLine.append(username)
    newLine.append(":")
    newLine.append(message)

    $('#chat-box').append(newLine)
    $('#chat-box').animate({scrollTop: $('#chat-box').get(0).scrollHeight}, 0)


    if($("#chat-box li").length > 120){
        $('#chat-box li').first().remove();
    }
}

const hideBorder = () => {
    console.log("Hiding Border...")
    $('#body-chat').removeClass('body-unlocked')
}

module.exports.document = document

const showBorder = () => {
    console.log("Showing Border...")
    $('#body-chat').addClass('body-unlocked')
}
module.exports.showBorder = showBorder