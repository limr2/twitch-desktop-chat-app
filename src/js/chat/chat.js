window.$ = window.jquery = require('jquery')
var config = require('electron-json-config')
const twitch = require('./js/chat/twitch.js')
const idle = require('./js/chat/idle.js')


// runs after page loaded
$(function(){
    loadConfig()
    twitch.connect(channelName)
    idle.start()
})

function loadConfig(){

    channelName = config.get('channel', null)
    chatOpacity = config.get('font.opacity', 1)
    chatFontSize = config.get('font.size', 20)
    chatFontColor = config.get('font.color', '#ffffff')

    setPersistedSettings()

}

function setPersistedSettings(){
    $('.chat-text').css('opacity', chatOpacity)
    $('.chat-text').css('font-size', chatFontSize + 'px')
    $('.chat-text').css('color', chatFontColor)
}



// Updates the chat display
function updateChat(msg, context){
    
    idle.reset()

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
    var messageDiv = document.createElement('span')
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