import AWS from "aws-sdk";
import { v1 } from "uuid";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-west-2"
});

const getSignedUrl = (req, res) => {
  const key = `cover-${v1()}.jpeg`;

  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "hotelbucket",
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
