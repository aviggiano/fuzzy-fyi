import { config } from "@config";
import {
  S3Client,
  GetObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as _getSignedUrl } from "@aws-sdk/s3-request-presigner";
const s3 = new S3Client({
  region: config.aws.region,
});

export async function getSignedUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Key: key,
    Bucket: config.aws.s3.bucket,
  });
  return _getSignedUrl(s3, command, { expiresIn: 3600 });
}

export async function listObjects(prefix: string): Promise<string[]> {
  const client = new S3Client(config);
  const command = new ListObjectsCommand({
    Bucket: config.aws.s3.bucket,
    Prefix: prefix,
  });
  const response = await client.send(command);
  return (response.Contents?.map((content) => content.Key) || []) as string[];
}
