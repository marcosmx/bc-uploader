const { post } = require('axios')
const querystring = require('querystring')
const config = require('../config.json')

const TOKEN_URL = 'https://oauth.brightcove.com/v4/access_token'


var auth_string = Buffer.from(config.clientId + ":" + config.secret).toString('base64');

function getAccessToken() {
  return post(
    TOKEN_URL,
    querystring.stringify({grant_type:'client_credentials'}),
    {
      headers: {
        'Authorization': 'Basic ' + auth_string,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
  })
}

module.exports = {
  getAccessToken
}