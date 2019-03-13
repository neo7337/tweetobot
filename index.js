var debug = false;
var Twit = require('twit')
var T = new Twit(require('./config.js'))
var tweet = require('./tweets.js')

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

var hashtag = { q: '#avengers#endgame#marvel', count: 10, result_type: 'recent' }

//tweeting a fresh tweet 
function tweeter() {
    T.post('statuses/update', { status: tweet.tweetsToMake }, tweeted)
    console.log('testing the tweetobot')
}

//retweeting the latest tweet with the given hashtags
function retweetLatest() {
    T.get('search/tweets', tweet.retweetsToMake, function (error, data) {
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
setInterval(tweeter, 1000 * 40)

retweetLatest()
setInterval(retweetLatest, 1000 * 10)