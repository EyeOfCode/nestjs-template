import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { CommandModule } from 'nestjs-command';
import { UserCommand } from './users.command';
import { JwtUserStrategy } from '../../middleware/strategy/jwt-user.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CommandModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UserCommand, JwtUserStrategy],
  exports: [UsersService],
})
export class UsersModule {}
