import { Module } from '@nestjs/common';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.string().required(),
        AUTH_PORT: Joi.string().required(),
        AUTH_HOST: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.TCP,
            port: {
              host: configService.get<string>('AUTH_HOST'),
              port: +configService.get<string>('AUTH_PORT'),
            },
          };
        },
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
