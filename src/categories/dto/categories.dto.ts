import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CategoriesDto{
  @ApiProperty({ example: 'Interenership' })
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @ApiProperty({ example: 'This is for interns' })
  @IsString()
  @IsNotEmpty()
  description: string;



  }


  
