// id + display name 
// bttv channel emotes https://api.betterttv.net/3/cached/users/twitch/121059319
// ffz channel emotes https://api.betterttv.net/3/cached/frankerfacez/users/twitch/121059319
// global emotes https://api.betterttv.net/3/cached/emotes/global

// #region Helper Funcitons

const https = require('https')
const getEmoteRequest = async (url, twitchID) => {
    url = url+twitchID;
    const getEmotes = new Promise(async function(resolve, reject){
        const options = {
            host: 'api.betterttv.net',
            port: 443,
            path: url,
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Content-Length': 0,
            }
        }

        const req = await https.request(options, response => {

            let chunks = [];
            
            response.on('data', raw_data => {
                chunks.push(raw_data);
                }).on('end', function() {
                let data = Buffer.concat(chunks);

                if(response.statusCode != 200){
                    reject();
                } else {
                    emotes = JSON.parse(data);
                    resolve(emotes)
                }
            });
        })
        req.on('error', error => {
            reject({'Error': `${error}`})
        }) 
        req.end()
    })
    getEmotes
        .then(emotes => {
            return emotes;
        })
        .catch(error => {
            return null;
        })
}

// #endregion

function getBttvEmotes(twitchID){

    bttvEmotes = getEmoteRequest('/3/cached/users/twitch/', twitchID)
    ffzEmotes = getEmoteRequest('/3/cached/frankerfacez/users/twitch/', twitchID)
    globalEmotes = getEmoteRequest('/3/cached/emotes/global', '')
    
    // save into jobject

}
module.exports.getBttvEmotes = getBttvEmotes