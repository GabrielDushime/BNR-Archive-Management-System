import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async addDocument(dto: CreateDocumentDto, files: Express.Multer.File[], categoryId: number, userId: number, userEmail: string) {
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

  async getDocumentsByCategory(categoryId: number) {
    const documents = await this.prisma.documents.findMany({
      where: { categoryId },
    });

    if (!documents.length) {
      throw new NotFoundException('No documents found for this category');
    }

    return documents;
  }

  async getDocumentById(categoryId: number, documentId: number) {
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

  async updateDocument(categoryId: number, documentId: number, dto: UpdateDocumentDto) {
    const document = await this.prisma.documents.findFirst({
      where: {
        Id: documentId,
        categoryId,
      },
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
        message: 'Document Updated successfully',
        updatedDocument
    } 
  }

  async deleteDocument(categoryId: number, documentId: number) {
    const document = await this.prisma.documents.findFirst({
      where: {
        Id: documentId,
        categoryId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.prisma.documents.delete({
      where: { Id: documentId },
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
      message: 'Document deleted successfully',
    };
  }
}
