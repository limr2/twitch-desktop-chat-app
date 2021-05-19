var tmi = require('tmi.js');
window.$ = window.jquery = require('jquery')
var config = require('electron-json-config')

var client = null;

const connect = (channelName) => {

    // Returns if no channel
    if(!channelName) return

    // Disconnects current connection if applicable
    if(client) {
        console.log("Disconnecting...")
        client.disconnect()
    }

    console.log("Reading " + channelName + "'s chat...")
    
    // Creates new client to connect to channel
    client = new tmi.client({
        channels: [channelName]
    });
 
    // Registers our event handlers (defined below)
    client.on('connected', onConnectedHandler);
    client.on('message', onMessageHandler);

    // Connects to twitch channel:
    client.connect();
}

module.exports.connect = connect

const disconnect = () => {
    console.log('disconnecting')
    if(client)
        client.disconnect()
    client =  null
}

module.exports.disconnect = disconnect

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    updateChat(msg, context)
}
 
 // Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}


