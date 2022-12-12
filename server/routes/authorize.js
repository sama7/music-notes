const express = require('express');
const router = express.Router();
const spotifyWebApi = require('spotify-web-api-node');
const { DateTime } = require('luxon');

// const request = require('request'); // "Request" library
// const port = process.env.PORT || 5000;
const clientPort = 3000;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
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
    // const state = req.query.state;

    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
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
                const access_token = data.body['access_token'];
                const refresh_token = data.body['refresh_token'];
                const expires_in = data.body['expires_in'];

                spotifyApi.setAccessToken(access_token);
                spotifyApi.setRefreshToken(refresh_token);

                console.log('access_token:', access_token);
                console.log('refresh_token:', refresh_token);

                console.log(
                    `Sucessfully retreived access token at ${DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)}. Expires in ${expires_in} s.`
                );
                // res.send('Success! You can now close the window.');
                // console.log(data.body);

                // const params = new URLSearchParams({
                //     access_token: access_token,
                //     refresh_token: refresh_token,
                // });
                // res.redirect(`http://localhost:${clientPort}/#` + params.toString());

                setInterval(async () => {
                    const data = await spotifyApi.refreshAccessToken();
                    const access_token = data.body['access_token'];

                    console.log('The access token has been refreshed at ' + DateTime.now().toLocaleString(DateTime.DATETIME_SHORT));
                    console.log('access_token:', access_token);
                    spotifyApi.setAccessToken(access_token);
                    // const params = new URLSearchParams({
                    //     access_token: access_token,
                    //     refresh_token: refresh_token,
                    // });
                    // res.redirect(`http://localhost:${clientPort}/#` + params.toString());
                }, expires_in / 2 * 1000);
                return spotifyApi.getUserPlaylists();
            })
            .then(data => {
                // console.log('previous: ' + data.body.previous);
                // console.log('next: ' + data.body.next);
                // console.log('total: ' + data.body.total);
                // console.log(data.body);
                res.json(data.body.items);
            })
            .catch(error => {
                console.error('Error:', error);
                res.send(`Error: ${error}`);
                next(error);
            });
    }
});

router.route('/tracks').get(function (req, res, next) {
    const playlistID = req.query.playlistID;
    spotifyApi.getPlaylistTracks(playlistID)
        .then(data => {
            console.log(data.body.items);
            res.json(data.body.items);
        })
        .catch(error => {
            console.error('Error getting Tokens:', error);
            res.send(`Error getting Tokens: ${error}`);
            next(error);
        });
});

module.exports = router;