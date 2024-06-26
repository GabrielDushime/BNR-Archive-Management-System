import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { SignInDto } from './dto/signin.dto';
import { UpdateDto } from './dto/update.dto';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test_secret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
    config = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

 

  describe('signin', () => {
    
    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const dto: SignInDto = {
        email: 'john@example.com',
        password: 'wrong_password',
      };

      (prisma.users.findUnique as jest.Mock).mockResolvedValue({
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: await argon.hash('password'),
        Role: 'user',
      });

      jest.spyOn(argon, 'verify').mockResolvedValue(false);

      await expect(service.signin(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an UnauthorizedException if user not found', async () => {
      const dto: SignInDto = {
        email: 'john@example.com',
        password: 'password',
      };

      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.signin(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getUserById', () => {
    it('should return the user if found', async () => {
      const userId = 1;
      const user = {
        Id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        Role: 'user',
      };

      (prisma.users.findUnique as jest.Mock).mockResolvedValue(user);

      const result = await service.getUserById(userId);
      expect(result).toEqual(user);
    });

    it('should throw a NotFoundException if user not found', async () => {
      const userId = 1;

      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getUserById(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [
        {
          Id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          Role: 'user',
        },
        {
          Id: 2,
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          Role: 'admin',
        },
      ];

      (prisma.users.findMany as jest.Mock).mockResolvedValue(users);

      const result = await service.getAllUsers();
      expect(result).toEqual(users);
    });
  });

  describe('deleteUserById', () => {
    it('should delete the user if found', async () => {
      const userId = 1;
      const user = {
        Id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        Role: 'user',
      };

      (prisma.users.findUnique as jest.Mock).mockResolvedValue(user);

      const result = await service.deleteUserById(userId);
      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should throw a NotFoundException if user not found', async () => {
      const userId = 1;

      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteUserById(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUserById', () => {
    it('should update the user if found', async () => {
      const userId = 1;
      const dto: UpdateDto = {
        firstName: 'John',
        lastName: 'Smith',
        email: 'johnsmith@example.com',
        Role: 'admin',
      };

      const user = {
        Id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        Role: 'user',
      };

      (prisma.users.findUnique as jest.Mock).mockResolvedValue(user);
      (prisma.users.update as jest.Mock).mockResolvedValue({
        ...user,
        ...dto,
      });

      const result = await service.updateUserById(userId, dto);
      expect(result).toEqual({
        ...user,
        ...dto,
      });
    });

    it('should throw a NotFoundException if user not found', async () => {
      const userId = 1;
      const dto: UpdateDto = {
        firstName: 'John',
        lastName: 'Smith',
        email: 'johnsmith@example.com',
        Role: 'admin',
      };

      (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateUserById(userId, dto)).rejects.toThrow(NotFoundException);
    });
  });
});
