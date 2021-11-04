// Badges
const https = require('https')

var globalBadges = null
var subBadges = null


function startup(twitchID){

    // refreshes global twitch badges
    refreshGlobalBadges()

    // refreshes sub badges
    refreshSubBadges()

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

    const badges = await https.request(options, res => {
        console.log(`>>> statusCode: ${res.statusCode}`)
      
        let chunks = [];
        res.on('data', raw_data => {
            chunks.push(raw_data);
            }).on('end', function() {
            let data   = Buffer.concat(chunks);
            let _badges = JSON.parse(data);
            return _badges
        });
    })
      

    req.on('error', error => {
        console.error(error)
    })

    req.end()

    console.log(`>>> badges: ${badges}`)
}
// updates local badges
// called once on started
// needs to be called everytime channel is changed
const refreshSubBadges = (twitchID) => {

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