//{ broadcaster: '1', subscriber: '12', glitchcon2020: '1' }
var config = require('electron-json-config')

var subBadges = config.get(`badges.channel.subscriber.versions`)

const refreshBadges = (newBadges) => {
    subBadges = newBadges
} 
module.exports.refreshBadges = refreshBadges;

const getBadges = (badges) => {
    // maybe append into a array? O_O;
    if(badges == null){
        return
    }
    var badgeList = []
    // go through the dict
    for (const [key, value] of Object.entries(badges)) {
        var badge = document.createElement('img')
        badge.classList.add('badge')
        // is subscriber badge?
        if(key == 'subscriber'){
            // get subscriber badge
            badge.src = subBadges[value]['image_url_1x']
            // badge.src = config.get(`badges.channel.subscriber.versions.${value}.image_url_1x`,`badges.global.subscriber.versions.1.image_url_1x`)
        } else{
            // get another badge
            badge.src = config.get(`badges.global.${key}.versions.${value}.image_url_1x`)
        }
        badgeList.push(badge)
    }
    badgeList.push(' ')
    return badgeList
}
module.exports.getBadges = getBadges;

