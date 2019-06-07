const { get } = require('axios');

const BASE_URL ='https://ingest.api.brightcove.com/v1/accounts/{accountId}/videos/{videoId}/upload-urls/{sourceName}'


function getBucket(accountId, videoId, sourceName, accessToken) {
  const url = BASE_URL.replace('{accountId}', accountId).replace('{videoId}', videoId).replace('{sourceName}', sourceName);
  return get(url, {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });
}


module.exports = {
  getBucket
}