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

  async addDocument(dto: CreateDocumentDto, files: Express.Multer.File[], directorateId: string, departmentId: string, divisionId: string, typeId: string, userId: string, userEmail: string) {

    // Fetch directorate, department, and division
    const directorate = await this.prisma.directorates.findUnique({
      where: { Id: directorateId },
    });
  
    if (!directorate) {
      throw new NotFoundException('Directorate not found');
    }
  
    const department = await this.prisma.departments.findUnique({
      where: { Id: departmentId },
    });
  
    if (!department) {
      throw new NotFoundException('Department not found');
    }
  
    const division = await this.prisma.divisions.findUnique({
      where: { Id: divisionId },
    });
  
    if (!division) {
      throw new NotFoundException('Division not found');
    }
  
    const type = await this.prisma.types.findUnique({
      where: { Id: typeId },
    });
  
    if (!type) {
      throw new NotFoundException('Type not found');
    }
  
    
    const firstLetterDirectorate = directorate.directorateName.charAt(0).toUpperCase();
    const firstLetterDepartment = department.departmentName.charAt(0).toUpperCase();
    const firstLetterDivision = division.divisionName.charAt(0).toUpperCase();
  
    const existingDocuments = await this.prisma.documents.count({
      where: {
        directorateId,
        departmentId,
        divisionId,
      },
    });
  
    const referenceId = `${firstLetterDirectorate}${firstLetterDepartment}${firstLetterDivision}${existingDocuments + 1}`;
  
    
    const uploadResults = await Promise.all(files.map(file => this.uploadToCloudinary(file)));
    const fileUrl = uploadResults.map(result => result.secure_url).join(', ');
  
   
    const document = await this.prisma.documents.create({
      data: {
        docName: dto.docName,
        docDescription: dto.docDescription,
        fileUrl,
        typeId,
        divisionId,
        typeName: type.typeName,
        divisionName: division.divisionName,
        userId,
        userEmail,
        directorateId,
        departmentId,
        directorateName: directorate.directorateName,
        departmentName: department.departmentName,
        referenceId,
      },
    });
  
    
    await this.prisma.types.update({
      where: { Id: typeId },
      data: {
        docUpload: {
          push: document.Id,
        },
      },
    });
  
    return {
      message: 'Document added to the type successfully',
      document,
    };
  }
  

  async getAllDocuments() {
    return await this.prisma.documents.findMany();
  }

  async getDocumentsByType(typeId: string) {
    const documents = await this.prisma.documents.findMany({
      where: { typeId },
    });

    if (!documents.length) {
      throw new NotFoundException('No documents found for this type');
    }

    return documents;
  }

  async getDocumentById(directorateId: string,departmentId: string,divisionId: string,typeId: string,  documentId: string) {
    const document = await this.prisma.documents.findFirst({
      where: {
        directorateId,
        departmentId,
        divisionId,
        typeId,
        Id: documentId,
      
    
        
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
      console.error(`Failed to fetch document from Cloudinary: ${error.message}`);
      throw new Error(`Failed to fetch document from Cloudinary: ${error.message}`);
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
  async searchDocumentsByReferenceId(referenceId: string) {
    const documents = await this.prisma.documents.findMany({
      where: { referenceId: { contains: referenceId, mode: 'insensitive' } },
    });

    if (!documents.length) {
      throw new NotFoundException('No documents found with this reference ID');
    }

    return documents;
  }

}
