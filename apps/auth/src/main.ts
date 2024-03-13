import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";

import { AuthModule } from "./auth.module";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: configService.get<string>("REDIS_HOST"),
      port: +configService.get<string>("REDIS_PORT"),
    },
  });
  await app.startAllMicroservices();
  await app.listen(+configService.get<string>("HTTP_PORT"));
}
bootstrap();
