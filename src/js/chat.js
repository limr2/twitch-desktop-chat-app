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
    // twitchEmoji.add("roselol");
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
    message.style.marginLeft = "5px";

    username.innerText = context['display-name'];
    message.innerHTML = twitchEmoji.parse(msg, { emojiSize : 'small' });

    newLine.append(username)
    newLine.append(":")
    newLine.append(message)

    $('#chat-box').append(newLine)
    $('#chat-box').animate({scrollTop: $('#chat-box').get(0).scrollHeight}, 0)

    if($("#chat-box li").length > 20){
        $('#chat-box li').first().remove();
    }
}