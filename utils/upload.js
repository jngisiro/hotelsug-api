const AWS = require("aws-sdk");
// const uuid = require("uuid ");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

exports.getSignedUrl = (req, res) => {
  // const key = `${req.user.id}/${req.Food.id}.jpeg`;
  const key = "bucketimage.jpg";

  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "foodie-bucket",
      ContentType: "image/jpeg",
      Key: key,
    },
    (err, url) =>
      res.status(200).json({
        status: "success",
        result: {
          key,
          url,
        },
      })
  );
};
