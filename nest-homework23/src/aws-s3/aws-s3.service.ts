import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Body, Injectable } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class AwsS3Service {
  private storageService;
  private bucketName;

  constructor() {
    console.log(process.env.AWS_BUCKET_NAME);
    this.bucketName = process.env.AWS_BUCKET_NAME;
    this.storageService = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });
  }
  async uploadFile(filePath: string, file) {
    if (!filePath) return;

    const config = {
      Key: filePath,
      Bucket: this.bucketName,
      File: file.buffer,
    };

    const commannd = new PutObjectCommand(config);
    await this.storageService.send(commannd);
    return filePath;
  }

  async getFileById(filePath: string) {
    if (!filePath) return;

    console.log(`Fetching file from S3: ${filePath}`);
    const config = {
      Bucket: this.bucketName,
      Key: filePath,
    };

    const command = new GetObjectCommand(config);
    const fileStream = await this.storageService.send(command);

    const chunks = [];
    if (fileStream.Body instanceof Readable) {
      for await (let stream of fileStream.Body) {
        chunks.push(stream);
      }
      const fileBuffer = Buffer.concat(chunks);
      const b64 = fileBuffer.toString('base64');
      const file = `data:${fileStream.ContentType};base64,${b64}`;
      return file;
    }
  }
  async deleteByuId(fileId) {
    if (!fileId) return {};
    const config = {
      Bucket: this.bucketName,
      Key: fileId,
    };
    const command = new DeleteObjectCommand(config);
    await this.storageService.send(command);

    return fileId;
  }
}
