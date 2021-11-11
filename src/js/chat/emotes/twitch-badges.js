// Badges
const https = require('https')
const config = require('electron-json-config')
const twitchAPI = require('../../api/twitch-api')

var globalBadges = null
var subBadges = null


const startup = (twitchID) => {

    return new Promise(async function(resolve, reject){
        
        // refreshes global twitch badges
        // refreshGlobalBadges()

        // refreshes sub badges
        await refreshSubBadges(twitchID)
        resolve()
    })

}
module.exports.startup = startup

const refreshGlobalBadges = async () => {

    const options = {
        host: 'badges.twitch.tv',
        port: 443,
        path: '/v1/badges/global/display',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': 0,
        }
    }

    const req = await https.request(options, res => {
        if(res.statusCode != 200) return
      
        let chunks = [];

        res.on('data', raw_data => {
            chunks.push(raw_data);
            }).on('end', function() {
            let data   = Buffer.concat(chunks);
            globalBadges = JSON.parse(data)['badge_sets'];
            // console.log(globalBadgeList)
            // console.log(2)
        });
    })
    
    req.on('error', error => {
        console.error(error)
    })

    req.end()

    console.log(1)
}
module.exports.refreshGlobalBadges = refreshGlobalBadges


// updates local badges
// called once on app start
// needs to be called everytime the apps twitch channel is changed
const refreshSubBadges = async (twitchID) => {
    // console.log(`attempting refresh ${twitchID}`)
    return new Promise(async function(resolve, reject){
        console.log('STARTED GETTING BADGES')
        subBadges = await twitchAPI.getBadges(twitchID)
        if(subBadges) if(subBadges['subscriber']) if(subBadges['subscriber']['versions'])
            subBadges = subBadges['subscriber']['versions']
        console.log('FINISHED GETTING BADGES')
        resolve()
    })
    
    

}
module.exports.refreshSubBadges = refreshSubBadges


// gets current instances/channels subBadges object
const getCurrentChannelSubBadges = () => {
    // console.log(subBadges)
    return subBadges
}

module.exports.getCurrentChannelSubBadges = getCurrentChannelSubBadges


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