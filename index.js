var express = require('express');
var app = express();
var Twit = require('twit')
var T = new Twit(require('./config.js'))
const fs = require('fs')
var request = require("request");
let tweet = JSON.parse(fs.readFileSync('tweets.json', 'utf-8'))

var port_number = process.env.PORT || 3000;

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

function tweetSetup() {
    var options = {
        url: "https://geek-jokes.sameerkumar.website/api",
        headers: {
            'User-Agent': 'request'
        }
    };

    return new Promise((resolve, reject) => {

        request.get(options, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}

function tweetthetweet() {
    var tweetPromise = tweetSetup();
    tweetPromise.then(function (tweet) {
        var tweetOfTheDay = tweet;
        tweeter(tweetOfTheDay);
    })
}


//tweeting a fresh tweet 
function tweeter(twt) {
    if (undefined !== twt) {
        console.log(twt + tweet["geekhashtags"].tags)
        T.post('statuses/update', { status: twt + tweet["geekhashtags"].tags }, tweeted);
        console.log("tweet of the day tweeted.");
    } else {
        var randomNumber = Math.floor(Math.random() * 5) + 1;
        T.post('statuses/update', { status: tweet["tweetMessages"][randomNumber].message }, tweeted)
        console.log('tweet tweeted')
    }
}

//retweeting the latest tweet with the given hashtags
/* function retweetLatest() {
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
} */

function tweeted(err, reply) {
    if (err !== undefined) {
        console.log(err)
    } else {
        console.log('Tweeted: ' + reply.text)
    }
}

/* tweeter()
setInterval(tweeter, 1000 * 10)

retweetLatest()
setInterval(retweetLatest, 1000 * 10)
 */
tweetthetweet()
setInterval(tweetthetweet, 1000 * 60 * 60 * 24)
app.listen(port_number);
console.log('Server running at Port ' + port_number);