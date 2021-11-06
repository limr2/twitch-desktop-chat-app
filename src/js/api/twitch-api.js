
const https = require('https')



const getBadges = async (twitchID) => {

    return new Promise(async function(resolve, reject){
        const options = {
            host: 'badges.twitch.tv',
            port: 443,
            path: `/v1/badges/channels/${twitchID}/display?language=en`,
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Content-Length': 0,
            }
        }

        const req = await https.request(options, response => {
            console.log(`>>> twitch-api.js : Status Code: ${response.statusCode}`)

            let chunks = [];
            
            response.on('data', raw_data => {
                chunks.push(raw_data);
                }).on('end', function() {
                let data   = Buffer.concat(chunks);

                if(response.statusCode != 200){
                    // reject(JSON.parse(data))
                } else {
                    badges = JSON.parse(data)['badge_sets'];
                    resolve(badges)
                }


            });
            
        })
        
        req.on('error', error => {
            reject({'Error': `${error}`})
        })
        
        req.end()
    })

    

}

module.exports.getBadges = getBadges