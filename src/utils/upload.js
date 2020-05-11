import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const getSignedUrl = (req, res) => {
  const key = `cover-${req.params.email}/.jpeg`;

  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "hotels.ug",
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

export default getSignedUrl;
