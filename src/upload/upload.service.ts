import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow('AWS_REGION'),
    });
  }

  async upload(fileName: string, file: Buffer): Promise<void> {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: 'addis-property',
          Key: fileName,
          Body: file,
        }),
      );
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getAllFiles(): Promise<string[]> {
    try {
      const command = new ListObjectsCommand({
        Bucket: 'addis-property',
      });
      const response = await this.s3Client.send(command);
      return response.Contents?.map((item) => item.Key) || [];
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }
}
