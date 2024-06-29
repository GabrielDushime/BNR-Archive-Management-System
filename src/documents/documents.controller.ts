import { Controller, Post, Get, Put, Delete, Param, Body, ParseIntPipe, UseInterceptors, UploadedFiles, UseGuards, Req } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';

@ApiTags('Documents Management')
@UseGuards(UserRoleGuard)
@ApiBearerAuth('Authentication')
@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('add/:categoryId')
  @ApiOperation({ summary: 'Add a new document to a category' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async addDocument(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: CreateDocumentDto,
    @Req() req
  ) {
   console.log(req.user);  
    const userId = req.user.Id; 
    const userEmail = req.user.email;
    return this.documentsService.addDocument(dto, files, categoryId, userId, userEmail);
  }

  @Get(':categoryId')
  @ApiOperation({ summary: 'Get all documents from a category' })
  async getDocumentsByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.documentsService.getDocumentsByCategory(categoryId);
  }

  @Get(':categoryId/:documentId')
  @ApiOperation({ summary: 'Get a single document by ID from a category' })
  async getDocumentById(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Param('documentId', ParseIntPipe) documentId: number
  ) {
    return this.documentsService.getDocumentById(categoryId, documentId);
  }

  @Put(':categoryId/:documentId')
  @ApiOperation({ summary: 'Update a document in a category' })
  async updateDocument(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Param('documentId', ParseIntPipe) documentId: number,
    @Body() dto: UpdateDocumentDto
  ) {
    return this.documentsService.updateDocument(categoryId, documentId, dto);
  }

  @Delete(':categoryId/:documentId')
  @ApiOperation({ summary: 'Delete a document from a category' })
  async deleteDocument(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Param('documentId', ParseIntPipe) documentId: number
  ) {
    return this.documentsService.deleteDocument(categoryId, documentId);
  }
}
