import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDocumentDto {
    @ApiProperty({ example: 'Updated Workers' })
    @IsOptional()
    @IsString()
    docName?: string;
  
    @ApiProperty({ example: 'This is updated for workers' })
    @IsOptional()
    @IsString()
    docDescription?: string;
  
    /* @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    files: Express.Multer.File[]; */
  }