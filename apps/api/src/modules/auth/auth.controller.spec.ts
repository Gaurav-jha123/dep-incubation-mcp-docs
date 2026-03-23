import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  signup: jest.fn(),
  login: jest.fn(),
  refreshToken: jest.fn(),
  getProfile: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should call authService.signup and return result', async () => {
      const dto = {
        name: 'John',
        email: 'john@test.com',
        password: 'password123',
      };
      const expected = {
        user: { id: 1, name: 'John', email: 'john@test.com' },
        accessToken: 'token',
        refreshToken: 'refresh',
      };
      mockAuthService.signup.mockResolvedValue(expected);

      const result = await controller.signup(dto);

      expect(result).toEqual(expected);
      expect(mockAuthService.signup).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call authService.login and return result', async () => {
      const dto = { email: 'john@test.com', password: 'password123' };
      const expected = {
        user: { id: 1, name: 'John', email: 'john@test.com' },
        accessToken: 'token',
        refreshToken: 'refresh',
      };
      mockAuthService.login.mockResolvedValue(expected);

      const result = await controller.login(dto);

      expect(result).toEqual(expected);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('refresh', () => {
    it('should call authService.refreshToken and return new tokens', async () => {
      const dto = { refreshToken: 'old-refresh-token' };
      const expected = {
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      };
      mockAuthService.refreshToken.mockResolvedValue(expected);

      const result = await controller.refresh(dto);

      expect(result).toEqual(expected);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(
        'old-refresh-token',
      );
    });
  });

  describe('getProfile', () => {
    it('should call authService.getProfile with email from JWT', async () => {
      const req = { user: { email: 'john@test.com' } };
      const expected = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
        createdAt: new Date(),
      };
      mockAuthService.getProfile.mockResolvedValue(expected);

      const result = await controller.getProfile(req);

      expect(result).toEqual(expected);
      expect(mockAuthService.getProfile).toHaveBeenCalledWith('john@test.com');
    });
  });
});
