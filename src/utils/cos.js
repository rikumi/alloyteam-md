const COS = require('cos-nodejs-sdk-v5');
const dotenv = require('dotenv');
const mime = require('mime');
const uuid = require('uuid');
const axios = require('./axios');

dotenv.config();

const enableCOS = !!process.env.COS_SECRET_ID;
const cos = enableCOS ? new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
}) : null;

/**
 * 下载远程文件，上传到 COS并返回地址
 */
const putRemote = async (src) => {
  if (!enableCOS) return src;
  try {
    const { data, headers } = await axios.get(src, { responseType: 'arraybuffer' });
    const contentType = headers['Content-Type'] || headers['content-type'] || 'image/jpeg';
    const ext = mime.getExtension(contentType);
    const res = await new Promise((resolve, reject) => cos.putObject({
      Bucket: process.env.COS_BUCKET,
      Region: process.env.COS_REGION,
      Key: uuid.v4() + '.' + ext,
      ContentType: contentType,
      Body: Buffer.from(data),
    }, (err, data) => err ? reject(err) : resolve(data)));
    return 'https://' + res.Location;
  } catch (e) {
    return '#';
  }
}

module.exports = { putRemote };