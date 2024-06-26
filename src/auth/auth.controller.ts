import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthDto } from "./dto";
import { SignInDto } from "./dto/signin.dto";
import { RolesGuard } from "./roles.guard";
import { UpdateDto } from "./dto/update.dto";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}
  
  //user signUp

  @Post('signup')
  @ApiBody({ type: AuthDto })
  /* @UseGuards(RolesGuard) */
  signup(@Body() dto: AuthDto) {
    return this.authservice.signup(dto);
  }

  //User SignIn

  @Post('signin')
  signin(@Body() dto: SignInDto) {
    return this.authservice.signin(dto);
  }

  //Getting All Users

  @Get('users')
  getAllUsers() {
    return this.authservice.getAllUsers();
  }

  //Getting a User ByID

  @Get('user/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.authservice.getUserById(id);
  }

  //Updating a User

  @Put('update/user/:id')
  updateUserById(@Param('id', ParseIntPipe) id: number, @Body() dto:  UpdateDto) {
    return this.authservice.updateUserById(id, dto);
  }

  //Deleting user froom the Application

  @Delete('/Delete/user/:id')
  deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.authservice.deleteUserById(id);
  }
 
}
