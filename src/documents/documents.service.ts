import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';



@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,

  ) {}
  

  async uploadToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      }).end(file.buffer);
    });
  }

  async addDocument(dto: CreateDocumentDto, files: Express.Multer.File[], categoryId: string, userId: string, userEmail: string) {
    const uploadResults = await Promise.all(files.map(file => this.uploadToCloudinary(file)));
    const fileUrl = uploadResults.map(result => result.secure_url).join(', ');

    const document = await this.prisma.documents.create({
      data: {
        docName: dto.docName,
        docDescription: dto.docDescription,
        fileUrl,
        categoryId,
        userId,
        userEmail,
      },
    });

    const categoryDocuments = await this.prisma.documents.findMany({
      where: { categoryId },
    });

    await this.prisma.cats.update({
      where: { Id: categoryId },
      data: {
        docUpload: {
          set: categoryDocuments.map(doc => doc.Id.toString()),
        },
      },
    });

    return {
      message: 'Document added to the category successfully',
      document,
    };
  }
  async getAllDocuments() {
    return await this.prisma.documents.findMany();
  }

  async getDocumentsByCategory(categoryId: string) {
    const documents = await this.prisma.documents.findMany({
      where: { categoryId },
    });

    if (!documents.length) {
      throw new NotFoundException('No documents found for this category');
    }

    return documents;
  }
  
  async getDocumentById(categoryId: string, documentId: string) {
    const document = await this.prisma.documents.findFirst({
      where: {
        Id: documentId,
        categoryId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }
  async updateDocument(documentId: string, dto: UpdateDocumentDto) {
    const document = await this.prisma.documents.findFirst({
      where: { Id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const updatedDocument = await this.prisma.documents.update({
      where: { Id: documentId },
      data: {
        docName: dto.docName,
        docDescription: dto.docDescription,
      },
    });

    return { message: 'Document updated successfully', updatedDocument };
  }

  async deleteDocument(documentId: string) {
    const document = await this.prisma.documents.findFirst({
      where: { Id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.prisma.documents.delete({
      where: { Id: documentId },
    });

    return { message: 'Document deleted successfully' };
  }

  
 
  async findDocumentById(documentId: string): Promise<any> {
    const document = await this.prisma.documents.findUnique({
      where: { Id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  

  async getDocumentsByUserId(userId: string) {
    const documents = await this.prisma.documents.findMany({
      where: { userId }
    });

    if (!documents.length) {
      throw new NotFoundException('No documents found for this user');
    }

    return documents;
  }
  async searchDocumentsByName(docName: string) {
    const documents = await this.prisma.documents.findMany({
      where: { docName: { contains: docName, mode: 'insensitive' } },
    });

    if (!documents.length) {
      throw new NotFoundException('No documents found');
    }

    return documents;
  }

  async getDocumentStream(fileUrl: string): Promise<Readable> {
    try {
     

      const response = await axios.get(fileUrl, { responseType: 'stream' });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch document from Cloudinary. Status code: ${response.status}`);
      }

      return response.data as Readable;
    } catch (error) {
      console.error(`Failed to fetch document: ${error.message}`);
      throw new Error('Failed to fetch document from Cloudinary');
    }
  }

  async generateDownloadUrl(publicId: string): Promise<string> {
    try {
      return cloudinary.url(publicId, {
        resource_type: 'auto',
        type: 'authenticated', 
        sign_url: true, 
        secure: true,
      });
    } catch (error) {
      console.error(`Failed to generate download URL: ${error.message}`);
      throw new Error('Failed to generate download URL');
    }
  }

  
  }