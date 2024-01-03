import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }

  async login(id: string, remember = false) {
    const payload = { sub: id };
    let expiresIn = {
      expiresIn: this.configService.get<string>('auth.JWT_EXPIRES_IN'),
    };
    if (remember) {
      expiresIn = {
        expiresIn: this.configService.get<string>(
          'auth.JWT_EXPIRES_REMEMBER_IN',
        ),
      };
    }
    return this.jwtService.sign(payload, expiresIn);
  }
}
