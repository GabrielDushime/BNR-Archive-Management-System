import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { DocumentsModule } from './documents/documents.module';




dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    AuthModule,
    PrismaModule,
    CategoriesModule,
    DocumentsModule,
   
   
  ],
  

})

export class AppModule  {}

