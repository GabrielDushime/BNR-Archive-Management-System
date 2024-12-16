import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class DirectoratesDto{
  @ApiProperty({ example: 'Interenership' })
  @IsString()
  @IsNotEmpty()
  directorateName: string;

  @ApiProperty({ example: 'This is for interns' })
  @IsString()
  @IsNotEmpty()
  description: string;

  departmentName?: string;
  departmentId?: string;

  }


  
