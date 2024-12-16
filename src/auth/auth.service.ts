import { ForbiddenException, Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { SignInDto } from "./dto/signin.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UpdateDto } from "./dto/update.dto";

@Injectable({})
export class AuthService {
  private blacklistedTokens: Set<string> = new Set(); 

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}
   async signup(dto: AuthDto) {
    try {
      const directorates = await this.prisma.directorates.findMany({
        where: { Id: { in: dto.directorateIds } },
      });

      if (directorates.length !== dto.directorateIds.length) {
        throw new NotFoundException('One or more directorates not found');
      }

      const directorateNames = directorates.map(d => d.directorateName);

      const passwordHashed = await argon.hash(dto.password);

      const user = await this.prisma.users.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          password: passwordHashed,
          Role: dto.Role,
          directorateNames: directorateNames,  
          directorates: {
            create: directorates.map(directorate => ({
              directorate: {
                connect: { Id: directorate.Id },
              },
            })),
          },
        },
        include: {
          directorates: {
            include: {
              directorate: true,
            },
          },
        },
      });

      const token = await this.SignToken(user.Id, user.firstName, user.lastName, user.email, user.Role);

      return {
        message: 'User created successfully',
        token: token,
        user: {
          ...user,
          directorates: directorateNames, 
        },
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists. Please use a new one!');
        }
      }
      throw error;
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

    const token = await this.SignToken(user.Id, user.firstName, user.lastName, user.email, user.Role);
    return {
      message: 'Sign in successful',
      token: token,
      user: {
        Id: user.Id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        Role: user.Role
      }
    };
  }

  async SignToken(
    Id: string,
    firstName: string,
    lastName: string,
    email: string,
    Role: string,
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

  async getUserById(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { Id: userId },
      include: {
        directorates: {
          include: {
            directorate: true,
          },
        },
      },
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const directorateInfo = user.directorates.map(userDirectorate => ({
      Id: userDirectorate.directorate.Id,
      directorateName: userDirectorate.directorate.directorateName,
      description: userDirectorate.directorate.description,
    }));
  
    return {
      ...user,
      directorates: directorateInfo,
    };
  }
  

  async getAllUsers() {
    const users = await this.prisma.users.findMany({
      include: {
        directorates: {
          include: {
            directorate: true,
          },
        },
      },
    });
  
  
    return users.map(user => {
      const directorateInfo = user.directorates.map(userDirectorate => ({
        Id: userDirectorate.directorate.Id,
        directorateName: userDirectorate.directorate.directorateName,
        description: userDirectorate.directorate.description,
      }));
  
      return {
        ...user,
        directorates: directorateInfo,
      };
    });
  }
  
  async deleteUserById(userId: string) {
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
  async updateUserById(userId: string, dto: UpdateDto) {
    const user = await this.prisma.users.findUnique({
      where: { Id: userId },
      include: { directorates: true }, 
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (dto.directorateIds) {
      const directorates = await this.prisma.directorates.findMany({
        where: { Id: { in: dto.directorateIds } },
      });
  
      if (directorates.length !== dto.directorateIds.length) {
        throw new NotFoundException('One or more directorates not found');
      }
  
      const directorateNames = directorates.map(d => d.directorateName);
  
      await this.prisma.userDirectorate.deleteMany({
        where: { userId: userId },
      });
  
      await this.prisma.userDirectorate.createMany({
        data: dto.directorateIds.map(directorateId => ({
          userId: userId,
          directorateId: directorateId,
        })),
      });
  
      // Update the directorateNames in Users table
      await this.prisma.users.update({
        where: { Id: userId },
        data: {
          directorateNames: directorateNames,
        },
      });
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
  
    return {
      message: 'User updated successfully',
      updatedUser,
    };
  }
  
  async logout(token: string) {
    this.blacklistedTokens.add(token);
    return {
      message: 'Successfully logged out'
    };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  getJwtSecret(): string {
    return this.config.get('JWT_SECRET');
  }



}
