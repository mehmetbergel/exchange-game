import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '~/user/user.service';
import * as bcrypt from 'bcrypt';

const mockUserService = {
  findByEmail: jest.fn().mockResolvedValue({ email: 'test@test.com', password: 'hashedPassword' }),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockToken'),
};

jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user successfully', async () => {
    await service.validateUser('test@test.com', 'password');
    expect(mockUserService.findByEmail).toHaveBeenCalledWith('test@test.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
  });

  it('should return an access token on login', async () => {
    const user = { email: 'test@test.com', password: '123' };
    const result = await service.login(user);
    expect(result).toEqual({ access_token: 'mockToken' });
    expect(mockJwtService.sign).toHaveBeenCalledWith({ email: 'test@test.com' });
  });
});
