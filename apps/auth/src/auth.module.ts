import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.string().required(),
        TCP_PORT: Joi.string().required(),
        JWT_PRIVATE: Joi.string().required(),
        JWT_PUBLIC: Joi.string().required(),
        ACCESS_TOKEN_TTL: Joi.string().required(),
      }),
    }),
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_PRIVATE'),
        signOptions: {
          algorithm: 'RS256',
          expiresIn: configService.get<string>('ACCESS_TOKEN_TTL'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
