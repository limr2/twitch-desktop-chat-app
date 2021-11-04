const { ipcMain } = require('electron');
var config = require('electron-json-config')

// on app start
    // load global badge list
    // if channel selected,
        // load sub badge list

// on username change
    // load sub badge list


mainWindow = null    
const setWin = (win) => {
    mainWindow = win
}


function loadGlobalBadgeList(){
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
    getData(options, "global");
}
function loadSubBadgeList(channelID){
    const options = {
        host: 'badges.twitch.tv',
        port: 443,
        path: `/v1/badges/channels/${channelID}/display?language=en`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': 0,
        }
    }
    getData(options, "channel");
}

const refreshBadges = (channelID) => {
    loadGlobalBadgeList();
    loadSubBadgeList(channelID);
}
module.exports.refreshBadges = refreshBadges;

const https = require('https')
var badges = null;

async function getData(options, badgeType){

    const req = await https.request(options, res => {
        console.log(`>>> statusCode: ${res.statusCode}`)
      
        let chunks = [];
        res.on('data', d => {
            chunks.push(d);
            }).on('end', function() {
            let data   = Buffer.concat(chunks);
            let schema = JSON.parse(data);
            config.set(`badges.${badgeType}`,schema['badge_sets'])
            if(badgeType == "channel"){
                badges = schema['badge_sets']['subscriber']
                // mainWindow.webContents.send('sub-badges', badges)
            }
        });
    })
      
    req.on('error', error => {
        console.error(error)
    })

    req.end()    
}

ipcMain.handle(`get-badges`, async function(event){

    const req = await https.request(options, res => {
        console.log(`>>> statusCode: ${res.statusCode}`)
      
        let chunks = [];
        res.on('data', d => {
            chunks.push(d);
            }).on('end', function() {
            let data   = Buffer.concat(chunks);
            let schema = JSON.parse(data);
            config.set(`badges.${badgeType}`,schema['badge_sets'])
            if(badgeType == "channel"){
                badges = schema['badge_sets']['subscriber']
                // mainWindow.webContents.send('sub-badges', badges)
            }
        });
    })
    console.log('>>> badges here badgeman')
    return badges
})