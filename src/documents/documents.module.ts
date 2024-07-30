import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from '../multer.config';
import { CloudinaryConfigService } from 'src/cloudinary.service';

@Module({
  imports: [
    MulterModule.register(multerConfig),
    
  ],
  providers: [DocumentsService, PrismaService, JwtService, CloudinaryConfigService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
