import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '../../utils/http-exception';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../middleware/decorators/role.decorator';
import { JwtUserAuthGuard } from '../../middleware/guard/jwt-user.guard';
import { RolesGuard } from '../../middleware/guard/role.guard';
import { Role } from '../users/constant/role.enum';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../../middleware/decorators/auth.decorator';
import { UsersService } from '../users/users.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

  //Note: overline rate limit
  @Throttle({ default: { limit: 10, ttl: 100000 } })
  @Post('/login')
  async login(@Body() payload: LoginDto) {
    const user = await this.authService.validateUser(
      payload.email,
      payload.password,
    );
    if (user && user.id && user.isApprove) {
      const token = await this.authService.login(user.id, payload.remember);
      return {
        access_token: token,
      };
    }
    throw new UnauthorizedException('Unauthorized');
  }

  //Note: ignore rate limit
  @SkipThrottle()
  @Roles(Role.USER)
  @UseGuards(JwtUserAuthGuard, RolesGuard)
  @Get('/profile')
  @ApiBearerAuth()
  async profile(@CurrentUser() auth: User) {
    if (!auth?.id) {
      throw new UnauthorizedException('Unauthorized');
    }
    const { id } = auth;
    return this.userService.findById(id);
  }
}
