const express = require('express');
const router = express.Router();
const dbo = require('../db/conn');
const spotifyWebApi = require('spotify-web-api-node');
const { DateTime } = require('luxon');
// const port = process.env.PORT || 5000;
const clientPort = 3000;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const scopes = [
    'playlist-read-private',
    'playlist-read-collaborative',
];
const stateKey = 'spotify_auth_state';
const client_id = '267de355b91648638b917d32faa7e23b'; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = `http://localhost:${clientPort}/callback`; // Your redirect uri
const spotifyApi = new spotifyWebApi({
    redirectUri: redirect_uri,
    clientId: client_id,
    clientSecret: client_secret,
});

async function saveUserAccessToken(userID, accessToken) {
    try {
        const db_connect = dbo.getDb();
        const myquery = {
            user: userID,
        };
        const newvalues = {
            $set: {
                accessToken: accessToken,
                lastModified: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
            },
        };
        await db_connect
            .collection('users')
            .updateOne(myquery, newvalues, { upsert: true });
    } catch (error) {
        console.error(`Error in saveUserAccessToken(): ${error}`);
        throw error;
    }
}

async function saveUserRefreshToken(userID, refreshToken) {
    try {
        const db_connect = dbo.getDb();
        const myquery = {
            user: userID,
        };
        const newvalues = {
            $set: {
                refreshToken: refreshToken,
                lastModified: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
            },
        };
        await db_connect
            .collection('users')
            .updateOne(myquery, newvalues, { upsert: true });
    } catch (error) {
        console.error(`Error in saveUserRefreshToken(): ${error}`);
        throw error;
    }
}

async function getUserAccessToken(userID) {
    try {
        const db_connect = dbo.getDb();
        const myquery = {
            user: userID,
        };
        const result = await db_connect
            .collection('users')
            .findOne(myquery);
        if (!result) {
            console.log(`No record found for User ${userID}`);
            return;
        } else {
            return result.accessToken;
        }
    } catch (error) {
        console.error(`Error in getUserAccessToken(): ${error}`);
        throw error;
    }
}

async function getUserRefreshToken(userID) {
    try {
        const db_connect = dbo.getDb();
        const myquery = {
            user: userID,
        };
        const result = await db_connect
            .collection('users')
            .findOne(myquery);
        if (!result) {
            console.log(`No record found for User ${userID}`);
            return;
        } else {
            return result.refreshToken;
        }
    } catch (error) {
        console.error(`Error in getUserRefreshToken(): ${error}`);
        throw error;
    }
}

// This section will help you get the user's authorization
router.route('/login').get(function (req, res) {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);
    res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
});

// This section takes the authorization code from the previous call and returns
// an access token and refresh token to be used in later calls after checking
// the state parameter
router.route('/callback').get(function (req, res, next) {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
    let access_token;
    let refresh_token;
    let expires_in;
    let userID;

    if (error) {
        console.error('Callback Error:', error);
        next(error);
    }
    if (state === null || state !== storedState) {
        const params = new URLSearchParams({
            error: 'state_mismatch'
        });
        res.redirect(`http://localhost:${clientPort}/#` + params.toString());
    } else {
        res.clearCookie(stateKey);
        spotifyApi
            .authorizationCodeGrant(code)
            .then(data => {
                access_token = data.body['access_token'];
                refresh_token = data.body['refresh_token'];
                expires_in = data.body['expires_in'];

                spotifyApi.setAccessToken(access_token);
                spotifyApi.setRefreshToken(refresh_token);

                console.log('access_token:', access_token);
                console.log('refresh_token:', refresh_token);

                return spotifyApi.getMe();
            })
            .then(data => {
                userID = data.body.id;
                console.log(
                    'Sucessfully retrieved access token at ' + DateTime.now().toLocaleString(DateTime.DATETIME_SHORT) + ' for User ' + userID +
                    '. Expires in ' + expires_in + ' s.'
                );
                res.json(userID);
                return saveUserAccessToken(userID, access_token);
            })
            .then(data => {
                return saveUserRefreshToken(userID, refresh_token);
            })
            .then(data => {
                setInterval(async () => {
                    try {
                        const userRefreshToken = await getUserRefreshToken(userID);
                        spotifyApi.setRefreshToken(userRefreshToken);
                        const data = await spotifyApi.refreshAccessToken();
                        const access_token = data.body['access_token'];

                        console.log('The access token has been refreshed at ' + DateTime.now().toLocaleString(DateTime.DATETIME_SHORT) +
                            ' for User ' + userID);
                        console.log('access_token:', access_token);
                        await saveUserAccessToken(userID, access_token);
                    }
                    catch (error) {
                        console.error(`Error: ${error}`);
                        next(error);
                    }
                }, expires_in / 2 * 1000);
            })
            .catch(error => {
                console.error('Error:', error);
                next(error);
            });
    }
});

router.route('/playlists').get(async function (req, res, next) {
    try {
        const userAccessToken = await getUserAccessToken(req.query.userID)
        spotifyApi.setAccessToken(userAccessToken);
        const data = await spotifyApi.getUserPlaylists({
            limit: req.query.limit,
            offset: req.query.offset,
        });
        res.json(data.body);
    } catch (error) {
        console.error('Error:', error);
        next(error);
    }
});

router.route('/tracks').get(async function (req, res, next) {
    try {
        const userAccessToken = await getUserAccessToken(req.query.userID)
        spotifyApi.setAccessToken(userAccessToken);
        const playlistID = req.query.playlistID;
        const data = await spotifyApi.getPlaylistTracks(playlistID, {
            limit: req.query.limit,
            offset: req.query.offset,
        });
        res.json(data.body);
    } catch (error) {
        console.error('Error:', error);
        next(error);
    }
});

router.route('/cover').get(async function (req, res, next) {
    try {
        const userAccessToken = await getUserAccessToken(req.query.userID)
        spotifyApi.setAccessToken(userAccessToken);
        const playlistID = req.query.playlistID;
        const data = await spotifyApi.getPlaylist(playlistID);
        res.json(data.body);
    } catch (error) {
        console.error('Error:', error);
        next(error);
    }
});

module.exports = router;