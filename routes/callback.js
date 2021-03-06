var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var app = express();
var request = require("request");

global.access_token = '';

let redirect_uri = 
  process.env.REDIRECT_URI || 
  'http://localhost:3001/callback'

router.get('/', function(req, res, next) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    access_token = body.access_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    res.redirect(uri + '?access_token=' + access_token)


  })
}); 


module.exports = router;