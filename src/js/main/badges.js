//{ broadcaster: '1', subscriber: '12', glitchcon2020: '1' }
var config = require('electron-json-config')

// config.set(`badges.subscriber.versions.12.image_url_1x`,`https://static-cdn.jtvnw.net/badges/v1/8aeb00f2-2894-4755-bbbe-27ea7b866219/1`)
// config.set(`badges.global.broadcaster.versions.1.image_url_1x`,`https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1`)
// config.set(`badges.global.glitchcon2020.versions.1.image_url_1x`,`https://static-cdn.jtvnw.net/badges/v1/1d4b03b9-51ea-42c9-8f29-698e3c85be3d/1`)
// config.set(`badges.global.subscriber.versions.1.image_url_1x`,'https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1')

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
            badge.src = config.get(`badges.channel.subscriber.versions.${value}.image_url_1x`,`badges.global.subscriber.versions.1.image_url_1x`)
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

