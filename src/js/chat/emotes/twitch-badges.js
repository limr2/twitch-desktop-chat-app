// Badges
const https = require('https')
const config = require('electron-json-config')
const twitchAPI = require('../../api/twitch-api')

var globalBadges = null
var subBadges = null


const startup = (twitchID) => {

    return new Promise(async function(resolve, reject){
        
        // refreshes global twitch badges
        console.log(`before refresh globalBadges: ${globalBadges}`)
        await refreshGlobalBadges()
        console.log(`after refresh globalBadges: ${globalBadges}`)


        // refreshes sub badges
        await refreshSubBadges(twitchID)
        resolve()
    })

}
module.exports.startup = startup

const refreshGlobalBadges = async () => {
    return new Promise(async function(resolve, reject){
        globalBadges = await twitchAPI.getGlobalBadges()
        resolve()
    })
    
}
module.exports.refreshGlobalBadges = refreshGlobalBadges


// updates 'subBadges' object to the twitch channel with specified twitch id
const refreshSubBadges = async (twitchID) => {
    return new Promise(async function(resolve, reject){

        // gets badges from twitch api with specific twitch id
        subBadges = await twitchAPI.getBadges(twitchID)

        // because of await, after twitch api has received its response then does rest of function

        // if channel has badges, then set its badges
        if(subBadges) if(subBadges['subscriber']) if(subBadges['subscriber']['versions'])
            subBadges = subBadges['subscriber']['versions']

        // resolve the promise
        resolve()
    })
}
module.exports.refreshSubBadges = refreshSubBadges


// gets current instances/channels subBadges object
const getCurrentChannelSubBadges = () => {
    return subBadges
}
module.exports.getCurrentChannelSubBadges = getCurrentChannelSubBadges

// gets current instances/channels subBadges object
const getCurrentGlobalBadges = () => {
    return globalBadges
}

module.exports.getCurrentGlobalBadges = getCurrentGlobalBadges


// returns list of html img elements witht he badge

const getBadges = (badges) => {

    // returns if badges is empty
    if(!badges) return

    let badgeList = []

    for (const [key, value] of Object.entries(badges)) {
        let badge = document.createElement('img')
        badge.classList.add('badge')
        // is subscriber badge?
        if(key == 'subscriber'){
            // get subscriber badge
            badge.src = subBadges[value]['image_url_1x']
        } else{
            // get another badge
            badge.src = config.get(`badges.global.${key}.versions.${value}.image_url_1x`)
        }
        badgeList.push(badge)
    }
    badgeList.push(' ')
    return badgeList

}

module.exports.getBadges = getBadges