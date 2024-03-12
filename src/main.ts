import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as serverlessExpress from 'aws-serverless-express';

async function bootstrap() {
  const expressApp = express();
  // adapter that converts Lambda events into HTTP requests.
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET, POST, PUT, DELETE',
    credentials: true,
  });

  return app;
}

async function init() {
  if (process.env.NODE_ENV === 'development') {
    const app = await bootstrap();
    const config = new DocumentBuilder()
      .setTitle('Playlist example')
      .setDescription('The playlist API description')
      .setVersion('1.0')
      .addTag('Tunity')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000);
  }
}
init();

// For deployment to AWS Lambda
export const handler = async (event, context) => {
  const app = await bootstrap();
  const server = serverlessExpress.createServer(app);
  return serverlessExpress.proxy(server, event, context);
};
