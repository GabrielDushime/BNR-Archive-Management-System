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
import { superRoleGuard } from 'src/auth/guards/super.guard';



@Controller('document')
  
@ApiTags('Documents Management') 
@ApiBearerAuth('Authentication')


export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}
  
 
  @Post('add/:directorateId/:departmentId/:divisionId/:typeId')
  @UseGuards(UserRoleGuard)
  @ApiOperation({ summary: 'Add a new document to a type' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async addDocument(
    @Param('directorateId') directorateId: string,
    @Param('departmentId') departmentId: string,
    @Param('divisionId') divisionId: string,
    @Param('typeId') typeId: string,
   
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: CreateDocumentDto,
    @Req() req
  ) {
    const userId = req.user.Id;
    const userEmail = req.user.email;
    return this.documentsService.addDocument(dto, files,directorateId,departmentId, divisionId, typeId, userId, userEmail);
  }
  @Get('search/referenceId')
   @UseGuards(BothRoleGuard,superRoleGuard) 
   @ApiOperation({ summary: 'Search for documents by reference ID' })
   async searchDocumentsByReferenceId(@Query('referenceId') referenceId: string) {
    return this.documentsService.searchDocumentsByReferenceId(referenceId);
    
   }
  

  @Get('search')
   @UseGuards(BothRoleGuard,superRoleGuard) 
  @ApiOperation({ summary: 'Search for documents by name' })
  async searchDocumentsByName(@Query('docName') name: string) {
   return this.documentsService.searchDocumentsByName(name);
   
  }
 

  @Get('documents')
 @UseGuards(superRoleGuard) 
  @ApiOperation({ summary: 'Get all Documents' })
  getAllcats() {
    return this.documentsService.getAllDocuments();
  }
  @Get(':typeId')
  @ApiOperation({ summary: 'Get all documents from a type' })
  async getDocumentsByType(@Param('typeId') typeId: string) {
    return this.documentsService.getDocumentsByType(typeId);
  }

  @Get('download/:documentId')
  @ApiOperation({ summary: 'Download document from cloudinary' })
  async downloadDocument(@Param('documentId') documentId: string, @Res() res: Response) {
    try {
      const document = await this.documentsService.findDocumentById(documentId);
  
      if (!document || !document.fileUrl) {
        throw new NotFoundException('Document or file URL not found');
      }
  
      const fileStream = await this.documentsService.getDocumentStream(document.fileUrl);
      const fileExtension = extname(document.fileUrl);
      const fileName = `document${fileExtension}`;
  
      const mimeTypeMap: { [key: string]: string } = {
        '.pdf': 'application/pdf',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
       
      };
  
      const mimeType = mimeTypeMap[fileExtension.toLowerCase()] || 'application/octet-stream';
  
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', mimeType);
  
     
      console.log(`Streaming file: ${fileName} with MIME type: ${mimeType}`);
  
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
  @ApiOperation({ summary: 'Update a document in a type' })
  async updateDocument(
    @Param('documentId') documentId: string,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.documentsService.updateDocument(documentId, dto);
  }

  @Delete(':documentId')
   @UseGuards(BothRoleGuard) 
  @ApiOperation({ summary: 'Delete a document from a type' })
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


 

  @Get(':directorateId/:departmentId/:divisionId/typeId/:documentId')
  @UseGuards(BothRoleGuard) 
  @ApiOperation({ summary: 'Get a single document by ID from a directorate and department' })
  async getDocumentById(
    @Param('directorateId') directorateId: string,
    @Param('departmentId') departmentId: string,
    @Param('divisionId') divisionId: string,
    @Param('typeId') typeId: string,
    @Param('documentId') documentId: string
  ) {
    return this.documentsService.getDocumentById( directorateId,departmentId,divisionId,typeId,documentId);
  }
  
  



}