const path = require('path')
const aws = require('aws-sdk')
const fs = require('fs')
const stream = require('stream')



const {getAccessToken} = require('../auth/token')
const {getBucket} = require('../uploader/bucket')
const slugify = require('@sindresorhus/slugify')
const cms = require('../uploader/cms')
const config = require('../config.json')

let AT = '';
let asset;

const getFileSize =  function(file) {
  const stats = fs.statSync(file);
  return stats.size;
}

const sendToS3 = function(config) { 
  const bucket = config.data;
  const rs = fs.createReadStream(path.format(asset));
  const ws = new stream.PassThrough();
  const params = {
    Bucket: bucket.bucket,
    Key: bucket.object_key,
    Body: ws,
    ContentLength: getFileSize(path.format(asset))
  }
  const s3 = new aws.S3({
    apiVersion: 'latest',
    region: 'us-east-1',
    accessKeyId: bucket.access_key_id,
    secretAccessKey: bucket.secret_access_key,
    sessionToken: bucket.session_token    
  });

  let upload = s3.upload(params, {partSize: 5 * 1024 * 1024});
  // upload.on('httpUploadProgress', (progress) => {
  //   console.log('progress', progress);
  // });

  rs.pipe(ws);
  return Promise.resolve([upload, getFileSize(path.format(asset))]);
}


const sendAsset =  function(fileName) {
  return getAccessToken().then(response => {
    AT = response.data.access_token;
    asset = path.parse(fileName);
    return cms.setVideo(asset.name, AT); 
  }).then( response => {
    const videoId = response.data.id
    const sourcName = slugify(asset.name) + asset.ext;
    return getBucket(config.accountId, videoId, sourcName, AT);
  }).then (sendToS3)
  .catch(error => console.log(error));
}

module.exports = {
  sendAsset
}