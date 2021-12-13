import aws from 'aws-sdk';
import { v4 as uuid } from 'uuid';

class S3 {
  static async upload(key: string, document: Buffer): Promise<aws.S3.ManagedUpload> {
    const credentials = new aws.Credentials("access-key-id", "secret")
    const prefix = `/${uuid()}`;
    const uploadParams: aws.S3.Types.PutObjectRequest = { 
      Bucket: 'agendrix-sandbox-web-dev',
      Key: `${prefix}/${key}`,
      Body: document
  };

  return new aws.S3({credentials: credentials}).upload(uploadParams, function(error: Error, data: aws.S3.ManagedUpload.SendData) {
    if (error) {
      Promise.reject(error);
    }

    return Promise.resolve(data.Location);
  });
  }
}

export default S3;