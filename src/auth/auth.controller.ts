import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDto } from "./dto";
import { SignInDto } from "./dto/signin.dto";
import { UpdateDto } from "./dto/update.dto";
import { AdminRoleGuard } from "./guards/admin-role.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { Request } from 'express';

@Controller('auth')

export class AuthController {
  [x: string]: any;
  constructor(private authservice: AuthService) {}
   //User SignIn
 @ApiTags('Authentication')
 @Post('signin')
 signin(@Body() dto: SignInDto) {
   return this.authservice.signin(dto);
 }
   // User Logout
   @ApiTags('Authentication')
   @ApiBearerAuth('Authentication')
   @UseGuards(JwtAuthGuard)
   @Post('logout')
   @ApiOperation({ summary: 'Logout user' })
   logout(@Req() req: Request) {
     const authHeader = req.headers.authorization;
     const token = authHeader.split(' ')[1];
     return this.authservice.logout(token);
   }
}
@Controller('user')
/*  @UseGuards(AdminRoleGuard)  */
export class UserController {
  constructor(private authservice: AuthService) {}
  


   //user signUp
   @ApiTags('User Management')
   @ApiBearerAuth('Authentication')
 /*  @UseGuards(AdminRoleGuard)   */
   @ApiOperation({ summary: 'Adding a new User' })
  @Post('signup')
  @ApiBody({ type: AuthDto })

  signup(@Body() dto: AuthDto) {
    return this.authservice.signup(dto);
  }


  //Getting All Users
  @ApiTags('User Management')
  @Get('users')
  @ApiBearerAuth('Authentication')
  @ApiOperation({ summary: 'Get all users' })
  getAllUsers() {
    return this.authservice.getAllUsers();
  }

  //Getting a User ByID
  @ApiTags('User Management')
  @ApiBearerAuth('Authentication')
  @ApiOperation({ summary: 'Get user by ID' })
  @Get('user/:id')
  getUserById(@Param('id') id: string) {
    return this.authservice.getUserById(id);
  }

  //Updating a User
  @ApiTags('User Management')
  @ApiBearerAuth('Authentication')
 @UseGuards(AdminRoleGuard)  
  @ApiOperation({ summary: 'Updating User by ID' })
  @Put('update/user/:id')
  updateUserById(@Param('id') id: string, @Body() dto:  UpdateDto) {
    return this.authservice.updateUserById(id, dto);
  }

  //Deleting user from the Application
  @ApiTags('User Management')
  @ApiBearerAuth('Authentication')
  @ApiOperation({ summary: 'Delete user by ID' })
  @Delete('/Delete/user/:id')
  deleteUserById(@Param('id') id: string) {
    return this.authservice.deleteUserById(id);
  }
 
}