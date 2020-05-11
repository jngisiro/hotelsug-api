"use strict";

var AWS = require("aws-sdk"); // const uuid = require("uuid ");


var s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

exports.getSignedUrl = function (req, res) {
  // const key = `${req.user.id}/${req.Food.id}.jpeg`;
  var key = "bucketimage.jpg";
  s3.getSignedUrl("putObject", {
    Bucket: "foodie-bucket",
    ContentType: "image/jpeg",
    Key: key
  }, function (err, url) {
    return res.status(200).json({
      status: "success",
      result: {
        key: key,
        url: url
      }
    });
  });
};