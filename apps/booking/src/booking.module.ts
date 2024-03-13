import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import * as Joi from "joi";

import { AUTH_SERVICE, DatabaseModule, JwtGuard } from "@app/common";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { BookingDocument, BookingSchema } from "./booking.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        DATABASE_URI: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: BookingDocument.name, schema: BookingSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get<string>("REDIS_HOST"),
            port: +configService.get<string>("REDIS_PORT"),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService, JwtGuard],
})
export class BookingModule {}
