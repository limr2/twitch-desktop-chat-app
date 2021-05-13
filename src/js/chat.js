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
 
    // Load persisted settings
    if(config.get('opacity'))
        $('.chat-text').css('opacity', config.get('opacity'))
    
    if(config.get('font-size'))
        $('.chat-text').css('font-size', config.get('font-size') + 'px')

    if(config.get('color'))
        $('.chat-text').css('color', config.get('color'))

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

var idleTime = 0

// every 1000ms runs increment
var idleInterval = setInterval(function(){
    increment()
}, 1000)

// increment function
function increment(){
    idleTime += 1
    if(idleTime > 10) {
        idleTime = 11
        $('.chat-text').fadeOut()
    }
}

// resets idle
function resetIdle(){
    idleTime = 0
}

// Updates the chat display
function updateChat(msg, context){
    $('.chat-text').fadeIn()
    
    // when chat message is sent, resets the idle
    resetIdle()

    var newLine = document.createElement('li');
    var username = document.createElement('span');

    newLine.classList.add('line');
    username.classList.add('username');

    username.style.color = context['color'];

    username.innerText = context['display-name'];

    newLine.append(username)
    newLine.append(":")

    parseEmotes(newLine, msg, context)

    $('#chat-box').append(newLine)
    $('#chat-box').animate({scrollTop: $('#chat-box').get(0).scrollHeight}, 0)


    if($("#chat-box li").length > 120){
        $('#chat-box li').first().remove();
    }
}

// parses emotes
function parseEmotes(newLine, msg, context){
    var messageDiv = document.createElement('div')
    messageDiv.classList.add('message-container')

    var emotes = context['emotes']
    
    // Ignore if no emotes in message
    if(!emotes) {
        var span = getMsgHTML(msg)
        messageDiv.append(span)
        newLine.append(messageDiv)
        return msg
    }

    console.log('Parsing Emotes...')
    console.log('Emotes: ' + emotes)

    var emoteNames = {}

    for(var id in emotes){
        range = emotes[id][0].split('-')
        range[1] = parseInt(range[1]) + 1
        emoteName = msg.substring(range[0], range[1])
        emoteNames[emoteName] = id
    }

    console.log(emoteNames)
    
    splitMsg = msg.split(' ')

    workingMsg = " "
    console.log(splitMsg)
    splitMsg.forEach(function(word){
        if(emoteNames[word]){
            if(workingMsg){
                span = getMsgHTML(workingMsg)
                messageDiv.append(span)
                workingMsg = ""
            }
            img = getEmoteHTML(emoteNames[word])
            messageDiv.append(img)
        } else {
            workingMsg += word + " "
        }
    })
    if(workingMsg) {
        span = getMsgHTML(workingMsg)
        messageDiv.append(span)
    }
    
    console.log('msgdiv :)')
    newLine.append(messageDiv)
    
}

// returns span of text
function getMsgHTML(msg){
    var message = document.createElement('span');
    message.classList.add('message');
    message.innerText = msg;
    return message
}

// returns img with the emote 
function getEmoteHTML(emoteId){
    var emoteLink = 'https://static-cdn.jtvnw.net/emoticons/v1/'
    var emoteSize = '1.0'

    var img = document.createElement('img')
    img.classList.add('emote')
    h = parseInt(config.get('font-size'))+10
    img.style.height = h + 'px'
    img.src = emoteLink + emoteId + '/' + emoteSize

    return img
}