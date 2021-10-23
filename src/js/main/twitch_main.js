var tmi = require('tmi.js');
// window.$ = window.jquery = require('jquery')
var config = require('electron-json-config');
const { ipcMain } = require('electron');

var client = null;

const connect = (channelName) => {

    // Returns if no channel
    if(!channelName) return

    // Disconnects current connection if applicable
    if(client) {
        console.log("Disconnecting...")
        client.disconnect()
    }
    
    // Creates new client to connect to channel
    client = new tmi.client({
        channels: [channelName]
    });
 
    // Registers our event handlers (defined below)
    client.on('connected', onConnectedHandler);
    client.on('message', onMessageHandler);

    // Connects to twitch channel:
    console.log(`twitch_main.js: connect() => Connecting to '${channelName}'`)
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

const reconnect = (channelName) => {
    console.log("reconnecting")
    disconnect()
    connect(channelName)
}

module.exports.reconnect = reconnect


chatWindow = null

const setChatWin = (window) => {
    chatWindow = window
}

module.exports.setChatWin =setChatWin

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    console.log(context)
    if(chatWindow){
        chatWindow.webContents.send('update-chat', msg, context)
    }
    else{
        console.log(`Error: twitch_main.js: onMessageHandler() => chatWindow = null`)
    }
}
 
 // Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}