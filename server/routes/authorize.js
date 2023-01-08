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

async function saveUserAccessToken(userID, accessToken, expiresIn) {
    try {
        const db_connect = dbo.getDb();
        const myquery = {
            user: userID,
        };
        const newvalues = {
            $set: {
                accessToken: accessToken,
                expiresIn: expiresIn,
                lastModified: DateTime.now(),
            },
        };
        await db_connect
            .collection('users')
            .updateOne(myquery, newvalues, { upsert: true });
        // update the record if exists, otherwise create it
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
                lastModified: DateTime.now(),
            },
        };
        await db_connect
            .collection('users')
            .updateOne(myquery, newvalues, { upsert: true });
        // update the record if exists, otherwise create it
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
            if (DateTime.now() - result.lastModified >= result.expiresIn / 2 * 1000) {
                // either close to expired or expired
                spotifyApi.setRefreshToken(result.refreshToken);
                const data = await spotifyApi.refreshAccessToken();
                const access_token = data.body['access_token'];
                const expires_in = data.body['expires_in'];
                console.log('The access token has been refreshed at ' + DateTime.now().toLocaleString(DateTime.DATETIME_SHORT) +
                    ' for User ' + userID);
                console.log('access_token:', access_token, '\n');
                await saveUserAccessToken(userID, access_token, expires_in);
                return access_token;
            } else {
                // safe enough to use the current access token in db
                return result.accessToken;
            }
        }
    } catch (error) {
        console.error(`Error in getUserAccessToken(): ${error}`);
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
                    'Successfully retrieved access token at ' + DateTime.now().toLocaleString(DateTime.DATETIME_SHORT) + ' for User ' + userID +
                    '. Expires in ' + expires_in + ' s.\n'
                );
                return saveUserAccessToken(userID, access_token, expires_in);
            })
            .then(data => {
                return saveUserRefreshToken(userID, refresh_token);
            })
            .then(data => {
                res.json(userID);
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
        if (data.body.total === 740 && req.query.offset > 0) {
            // res.setHeader('Retry-After', 15);
            res.writeHead(429, { 'Retry-After': 60 });
            res.end('okay');
        } else {
            res.json(data.body);
        }
    } catch (error) {
        console.error('Error:', error);
        next(error);
    }
});

router.route('/playlist').get(async function (req, res, next) {
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