import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {TransformResponseInterceptor} from './common/interceptors/transform-response.interceptors';
import {LoggingInterceptor} from './common/interceptors/logging.interceptors';
import {HttpExceptionFilter} from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingService } from './common/logger/logger.service';

const whitelist = [process.env.WEB_URL];

async function bootstrap() {
  const logger = new LoggingService();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin as string) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformResponseInterceptor(),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

    // Swagger setup
    const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  logger.log('Application started listening to port: ', process.env.PORT);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
