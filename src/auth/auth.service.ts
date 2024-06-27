import { ForbiddenException, Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { SignInDto } from "./dto/signin.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UpdateDto } from "./dto/update.dto";

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: AuthDto) {
    const passwordhashed = await argon.hash(dto.password);
   
    try {
      const user = await this.prisma.users.create({
        data: {
          
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          password: passwordhashed,
          Role: dto.Role
        },
      });

      const token = await this.SignToken(user.email, user.firstName, user.lastName, user.Role,user.Id);
      return {
        message: 'User created successfully',
        token: token,
        user
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email exist. Please use a new one!');
        }
      }
    }  
  }

  async signin(dto: SignInDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon.verify(user.password, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.SignToken(user.email, user.firstName, user.lastName, user.Role,user.Id);
    return {
      message: 'Sign in successful',
      token: token,
      user: {
        Id:user.Id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        Role: user.Role
      }
    };
  }

  async SignToken(
    firstName: string,
    lastName: string,
    email: string,
    Role: string,
    Id:number
    
  ): Promise<{ access_token: string }> {
    const payload = {
      firstName,
      lastName,
      email,
      Role,
      Id
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60min',
      secret: secret
    });
    return {
      access_token: token
    };
  }

  async getUserById(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { Id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getAllUsers() {
    return await this.prisma.users.findMany();
  }

  async deleteUserById(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { Id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.users.delete({
      where: { Id: userId },
    });

    return {
      message: 'User deleted successfully'
    };
  }
  async updateUserById(userId: number, dto: UpdateDto) {
    const user = await this.prisma.users.findUnique({
      where: { Id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.users.update({
      where: { Id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        Role: dto.Role,
      },
    });

    return updatedUser;
  }
}
