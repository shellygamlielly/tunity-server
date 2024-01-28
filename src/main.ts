import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Playlist example')
    .setDescription('The playlist API description')
    .setVersion('1.0')
    .addTag('Tunity')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  await app.listen(3000);
}
bootstrap();
