function getBBTVEmoteHTML(emoteId){
    var emoteLink = `https://cdn.betterttv.net/emote/`
    var emoteSize = '/1x'

    var img = document.createElement('img')
    img.classList.add('emote')
    h = parseInt(config.get('font-size'))+10
    img.style.height = h + 'px'
    img.src = emoteLink + emoteId + '/' + emoteSize

    return img
}

// takes word and converts it to bttv link if its in emote list
const parseBttvEmote = (line) => {
    console.log(line)
    // check if word is in emote list 
    // if in word list, get id
    id = 0;
    return line
}
module.exports.parseBttvEmote = parseBttvEmote