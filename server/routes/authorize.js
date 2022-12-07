const express = require('express');
const router = express.Router();
const request = require('request'); // "Request" library
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

const stateKey = 'spotify_auth_state';
const client_id = '267de355b91648638b917d32faa7e23b'; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = `http://localhost:${clientPort}/callback`; // Your redirect uri

// This section will help you get the user's authorization
router.route('/login').get(function (req, res) {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    const scope = 'playlist-read-private playlist-read-collaborative';
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    });
    res.redirect('https://accounts.spotify.com/authorize?' + params.toString());
});

// This section takes the authorization code from the previous call and returns
// an access token and refresh token to be used in later calls, after checking
// the state parameter
router.route('/callback').get(function (req, res) {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
    if (state === null || state !== storedState) {
        const params = new URLSearchParams({
            error: 'state_mismatch'
        });
        res.redirect(`http://localhost:${clientPort}/#` + params.toString());
    } else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                const access_token = body.access_token,
                      refresh_token = body.refresh_token;
                const options = {
                    url: 'https://api.spotify.com/v1/me/playlists',
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'Content-Type': 'application/json'
                    },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                    console.log(body);
                });
                // we can also pass the token to the browser to make requests from there
                params = new URLSearchParams({
                    access_token: access_token,
                    refresh_token: refresh_token
                });
                res.redirect(`http://localhost:${clientPort}/#` + params.toString());
            } else {
                params = new URLSearchParams({
                    error: 'invalid_token'
                });
                res.redirect(`http://localhost:${clientPort}/#` + params.toString());
            }
        });
    }
});

module.exports = router;