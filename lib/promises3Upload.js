
// import entire SDK
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const fs = require('fs')
const mime = require('mime-types')
const dotenv = require('dotenv')
dotenv.config()

const promiseS3Upload = function (req) {
  return new Promise((resolve, reject) => {
    const filepath = req.file.path
    // const patharray = file.split('/')
    // const keyName = patharray[patharray.length-1].split('.')[0]
    console.log(filepath)
    // const keyName = req.file.originalname.split('.')[0]
    const extension = mime.extension(req.file.mimetype)
    const fileStream = fs.createReadStream(filepath)

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${req.file.filename}.${extension}`,
      Body: fileStream,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    }

    s3.upload(params, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = promiseS3Upload
