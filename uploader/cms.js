const { post } = require('axios')
const config = require('../config.json')

const VIDEO_URL = `https://cms.api.brightcove.com/v1/accounts/${config.accountId}/videos`

function setVideo(name, at) {
  return post(VIDEO_URL, {
    name: name
  }, {
    headers: {
      'Authorization': 'Bearer ' + at,
      'Content-Type': 'application/json'
    }    
  })
}

module.exports = {
  setVideo
}