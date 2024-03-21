import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
let server: Handler;

async function bootstrap_aws(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}
async function bootstrap_local() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}

if (process.env.NODE_ENV === 'development') {
  bootstrap_local();
}
export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (process.env.NODE_ENV !== 'development') {
    server = server ?? (await bootstrap_aws());
    return server(event, context, callback);
  }
};
