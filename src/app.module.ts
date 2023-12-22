import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

import AppConfig from 'config/app.config';
import DbConfig from 'config/database.config';
import ThrottlerConfig from 'config/throttler.config';
import AuthConfig from 'config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig, ThrottlerConfig, AuthConfig, DbConfig],
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('throttler.THROTTLE_TTL'),
          limit: config.get('throttler.THROTTLE_LIMIT'),
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        return {
          type: config.get('db').DB_TYPE,
          host: config.get('db').DB_HOST,
          port: config.get('db').DB_PORT,
          password: config.get('db').DB_PASS,
          username: config.get('db').DB_USER,
          entities: [__dirname + '/../**/*.entity.{js,ts}'],
          database: config.get('db').DB_NAME,
          synchronize: true,
          logging: true,
          extra: {
            charset: 'utf8mb4_unicode_ci',
          },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
