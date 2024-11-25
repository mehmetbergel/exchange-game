import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  login: jest.fn(() => ({ access_token: 'mockToken' })),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('should call login and return token', async () => {
    const result = await controller.login({ email: 'test@test.com', password: 'password' });
    expect(result).toEqual({ access_token: 'mockToken' });
    expect(authService.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
  });
});
