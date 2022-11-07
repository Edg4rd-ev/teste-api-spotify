const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
require('dotenv').config()

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ];

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

const app = express();
const port = 9000

app.get('/login', (req, res)=>{
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res)=>{
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if(error){
        console.error('Callback error: ', error);
        res.send(`Callback error: ${error}`)
        return;
    }

    spotifyApi.authorizationCodeGrant(code)
    .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        console.log('access_token: ', access_token);
        console.log('refresh_token: ', refresh_token);

        console.log(`Secessfully! Expires in: ${expires_in} s`)

        setInterval(async () => {
            const data = await spotifyApi.refreshAccessToken();
            const access_token = data.body['access_token'];
    
            console.log('The access token has been refreshed!');
            console.log('access_token:', access_token);
            spotifyApi.setAccessToken(access_token);
          }, expires_in / 2 * 1000);
        })
        .catch(error => {
          console.error('Error getting Tokens:', error);
          res.send(`Error getting Tokens: ${error}`);
    })
})

app.listen(port, ()=>{
    console.log('ta rodando na porta 9000 papito, tudo ok!')
});