import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
    @ApiProperty({ example: 'Workers' })
    @IsNotEmpty()
    @IsString()
    docName: string;
  
    @ApiProperty({ example: 'This is for workers' })
    @IsNotEmpty()
    @IsString()
    docDescription: string;
  

  
    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    files: Express.Multer.File[];
}
