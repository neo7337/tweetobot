var debug = false;
var Twit = require('twit')
var T = new Twit(require('./config.js'))
const fs = require('fs')
let tweet = JSON.parse(fs.readFileSync('tweets.json', 'utf-8'))

T.get('account/verify_credentials', {
    include_entities: false,
    sip_status: true,
    inclue_email: false
}, onAuthenticated)
function onAuthenticated(err, res) {
    if (err) {
        throw err
    }
    console.log('Authentication Successfull. Bot Running...\r\n')
}
//tweeting a fresh tweet 
function tweeter() {
    var randomNumber = Math.floor(Math.random() * 5) + 1;
    T.post('statuses/update', { status: tweet["tweetMessages"][randomNumber].message }, tweeted)
    console.log('tweet tweeted')
}

//retweeting the latest tweet with the given hashtags
function retweetLatest() {
    T.get('search/tweets', tweet["retweetMessage"], function (error, data) {
        var tweets = data.statuses
        if (undefined !== tweets) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text)
            }
            if (!error) {
                var retweetId = data.statuses[0].id_str
                T.post('statuses/retweet/' + retweetId, {}, tweeted)
            }
            else {
                if (debug) {
                    console.log('There was an error with your hashtag search : ', error)
                }
            }
        } else {
            console.log('Error in connection with Twitter!')
        }
    })
}

function tweeted(err, reply) {
    if (err !== undefined) {
        console.log(err)
    } else {
        console.log('Tweeted: ' + reply.text)
    }
}

tweeter()
setInterval(tweeter, 1000 * 10)

retweetLatest()
setInterval(retweetLatest, 1000 * 10)