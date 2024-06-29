import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from '../multer.config';

@Module({
  imports: [
    MulterModule.register(multerConfig),
  ],
  providers: [DocumentsService, PrismaService, JwtService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
