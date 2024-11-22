import { S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";
config();

const region = process.env.S3_BUCKET_REGION!;
const accessKey = process.env.S3_ACCESS_KEY!;
const secretKey = process.env.S3_SECRET_ACCESS_KEY!;

export const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: region,
});
