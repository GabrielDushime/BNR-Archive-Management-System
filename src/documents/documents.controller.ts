import { Controller, Post, Get, Put, Delete, Param, Body, UseInterceptors, UploadedFiles, UseGuards, Req, Res, HttpStatus, BadRequestException, NotFoundException, StreamableFile, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { BothRoleGuard } from 'src/auth/guards/both-role.guard';
import { Response } from 'express';
import { extname } from 'path';



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


  @Get('download/:documentId')
  async downloadDocument(@Param('documentId') documentId: string, @Res() res: Response) {
    try {
      const document = await this.documentsService.findDocumentById(documentId);
  
      if (!document || !document.fileUrl) {
        throw new NotFoundException('Document or file URL not found');
      }
  
      const fileStream = await this.documentsService.getDocumentStream(document.fileUrl);
      const fileExtension = extname(document.fileUrl) ; 
      const fileName = `document${fileExtension}`;
  
      const mimeTypeMap: { [key: string]: string } = {
        '.pdf': 'application/pdf',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.txt': 'text/plain',
        '.csv': 'text/csv',
        '.zip': 'application/zip',
        '.rar': 'application/x-rar-compressed',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.tiff': 'image/tiff',
        '.ico': 'image/x-icon',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
      };
  
      const mimeType = mimeTypeMap[fileExtension.toLowerCase()] || 'application/octet-stream';
  
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', mimeType);
      fileStream.pipe(res);
    } catch (error) {
      console.error(`Error in downloadDocument: ${error.message}`);
  
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Failed to stream the document',
        error: error.message,
      });
    }
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