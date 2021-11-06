// Badges
const https = require('https')
const config = require('electron-json-config')

var globalBadges = null
var subBadges = null
var twitchID = null


function startup(twitchID){

    // refreshes global twitch badges
    refreshGlobalBadges()

    // refreshes sub badges

    // TODO:    - double check this is where we save it? idk
    //          - needs a default value
    twitchID = config.get('user.id')

    refreshSubBadges(twitchID)

}

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
            console.log(globalBadgeList)
            console.log(2)
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
// called once on started
// needs to be called everytime channel is changed
const refreshSubBadges = async (twitchID) => {

    

}
module.exports.refreshSubBadges = refreshSubBadges


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



let x = 0
var y = 0
const z = 0

module.exports.getBadges = getBadges