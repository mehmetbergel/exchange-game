import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '~/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

async login(credentials: { email: string; password: string }) {
  const user = await this.userService.findByEmail(credentials.email);

  if (!user || !user.password) {
    throw new Error('Invalid email');
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid  password');
  }

  const payload = { email: user.email, sub: user.id };
  return {
    access_token: this.jwtService.sign(payload),
  };
}

}
