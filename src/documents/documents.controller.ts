import { Controller, Post, Get, Put, Delete, Param, Body, UseInterceptors, UploadedFiles, UseGuards, Req, Res, HttpStatus, BadRequestException, NotFoundException, StreamableFile, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { Response } from 'express';
import {  join } from 'path';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { createReadStream, existsSync } from 'fs';
import { BothRoleGuard } from 'src/auth/guards/both-role.guard';


@Controller('document')
  
@ApiTags('Documents Management') 
@ApiBearerAuth('Authentication')


export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}
  @Post('add/:categoryId')
  @UseGuards(UserRoleGuard)
  @ApiOperation({ summary: 'Add a new document to a category' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async addDocument(
    @Param('categoryId') categoryId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: CreateDocumentDto,
    @Req() req
  ) {
    const userId = req.user.Id;
    const userEmail = req.user.email;
    return this.documentsService.addDocument(dto, files, categoryId, userId, userEmail);
  }

  @Get('search')
  @UseGuards(BothRoleGuard)
  @ApiOperation({ summary: 'Search for documents by name' })
  async searchDocumentsByName(@Query('docName') name: string) {
   return this.documentsService.searchDocumentsByName(name);
   
  }

  @Get('documents')
  @UseGuards(AdminRoleGuard)
  @ApiOperation({ summary: 'Get all Documents' })
  getAllcats() {
    return this.documentsService.getAllDocuments();
  }
  @Get(':categoryId')
  @ApiOperation({ summary: 'Get all documents from a category' })
  async getDocumentsByCategory(@Param('categoryId') categoryId: string) {
    return this.documentsService.getDocumentsByCategory(categoryId);
  }

 
  @Put(':documentId')
  @UseGuards(BothRoleGuard)
  @ApiOperation({ summary: 'Update a document' })
  async updateDocument(
    @Param('documentId') documentId: string,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.documentsService.updateDocument(documentId, dto);
  }

  @Delete(':documentId')
  @UseGuards(BothRoleGuard)
  @ApiOperation({ summary: 'Delete a document' })
  async deleteDocument(@Param('documentId') documentId: string) {
    return this.documentsService.deleteDocument(documentId);
  }

  
  @Get('download/:documentId')
  @UseGuards(BothRoleGuard)
  @ApiOperation({ summary: 'Download a document' })
  async downloadDocument(
    @Param('documentId') documentId: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile> {
    try {
      const document = await this.documentsService.findDocumentById(documentId);
      const fileExtension = document.fileUrl.split('.').pop();
      const mimeType = this.getMimeType(fileExtension);

      res.set({
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${documentId}.${fileExtension}"`,
      });

      return await this.documentsService.getDocumentStream(documentId);
    } catch (error) {
      throw new NotFoundException('Document not found');
    }
  }

  private getMimeType(extension: string): string {
    switch (extension) {
      case 'pdf': return 'application/pdf';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'txt': return 'text/plain';
      default: return 'application/octet-stream';
    }
  }

  @Get('user/documents')
  @UseGuards(UserRoleGuard)
  @ApiOperation({ summary: 'Get all documents of the logged-in user' })
  async getDocumentsByUserId(@Req() req) {
    const userId = req.user.Id;
    return this.documentsService.getDocumentsByUserId(userId);
  }


 

  @Get(':categoryId/:documentId')
  @UseGuards(BothRoleGuard)
  @ApiOperation({ summary: 'Get a single document by ID from a category' })
  async getDocumentById(
    @Param('categoryId') categoryId: string,
    @Param('documentId') documentId: string
  ) {
    return this.documentsService.getDocumentById(categoryId, documentId);
  }

}




