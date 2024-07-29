import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ReadStream, createReadStream, existsSync } from 'fs';

import { extname, join } from 'path';
@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async addDocument(dto: CreateDocumentDto, files: Express.Multer.File[], categoryId: string, userId: string, userEmail: string) {
    const fileUrl = files.map(file => file.path).join(', ');

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

    return{
        message: 'Document added to the category Successfully',
        document
    } 
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

  
  async getDocumentStream(documentId: string) {
    const document = await this.findDocumentById(documentId);
    const filePath = join(process.cwd(), document.fileUrl);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File does not exist');
    }

   
    return createReadStream(filePath);
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

}


