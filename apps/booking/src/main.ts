import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { BookingModule } from "./booking.module";

async function bootstrap() {
  const app = await NestFactory.create(BookingModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = app.get(ConfigService);
  await app.listen(+configService.get<string>("HTTP_PORT"));
}
bootstrap();
