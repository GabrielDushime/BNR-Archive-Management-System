import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { SignInDto } from './dto/signin.dto';
import { UpdateDto } from './dto/update.dto';
import { NotFoundException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            signin: jest.fn(),
            getAllUsers: jest.fn(),
            getUserById: jest.fn(),
            updateUserById: jest.fn(),
            deleteUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup with correct DTO', async () => {
      const dto: AuthDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        Role: 'user',
      };

      authService.signup = jest.fn().mockResolvedValue({});

      await controller.signup(dto);

      expect(authService.signup).toHaveBeenCalledWith(dto);
    });
  });

  describe('signin', () => {
    it('should call authService.signin with correct DTO', async () => {
      const dto: SignInDto = {
        email: 'john@example.com',
        password: 'password',
      };

      authService.signin = jest.fn().mockResolvedValue({});

      await controller.signin(dto);

      expect(authService.signin).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllUsers', () => {
    it('should call authService.getAllUsers', async () => {
      authService.getAllUsers = jest.fn().mockResolvedValue([]);

      await controller.getAllUsers();

      expect(authService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should call authService.getUserById with correct ID', async () => {
      const userId = 1;

      authService.getUserById = jest.fn().mockResolvedValue({ Id: userId });

      await controller.getUserById(userId);

      expect(authService.getUserById).toHaveBeenCalledWith(userId);
    });
      
    
  });

  describe('updateUserById', () => {
    it('should call authService.updateUserById with correct ID and DTO', async () => {
      const userId = 1;
      const dto: UpdateDto = {
        firstName: 'John',
        lastName: 'Smith',
        email: 'johnsmith@example.com',
        Role: 'admin',
      };

      authService.updateUserById = jest.fn().mockResolvedValue({ Id: userId, ...dto });

      await controller.updateUserById(userId, dto);

      expect(authService.updateUserById).toHaveBeenCalledWith(userId, dto);
    });

    it('should throw NotFoundException if user not found', async () => {
        const userId = 1;
        const dto: UpdateDto = {
          firstName: 'John',
          lastName: 'Smith',
          email: 'johnsmith@example.com',
          Role: 'admin',
        };
  
        authService.updateUserById = jest.fn().mockRejectedValue(new NotFoundException('User not found'));
  
        await expect(controller.updateUserById(userId, dto)).rejects.toThrow(NotFoundException);
      });
  });

  describe('deleteUserById', () => {
    it('should call authService.deleteUserById with correct ID', async () => {
      const userId = 1;

      authService.deleteUserById = jest.fn().mockResolvedValue({ message: 'User deleted successfully' });

      await controller.deleteUserById(userId);

      expect(authService.deleteUserById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user not found', async () => {
        const userId = 1;
  
        authService.deleteUserById = jest.fn().mockRejectedValue(new NotFoundException('User not found'));
  
        await expect(controller.deleteUserById(userId)).rejects.toThrow(NotFoundException);
      });
  });
});