import { IsArray, IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: 'Gabriel' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'DUSHIME' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'dushimegabriel@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'D221016855@g' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'user', default: 'user' })
  @IsString()
  @IsNotEmpty()
  Role: string;

  @ApiProperty({ example: ['Directorate-id1', 'Directorate-id2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty({ each: true })
  directorateIds: string[];

  constructor() {
    this.Role = 'user';
  }
}
