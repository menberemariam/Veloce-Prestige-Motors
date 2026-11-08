import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Allow the separately-deployed frontend (Vercel) to call this API,
  // including cookie-session credentials.
  app.enableCors({ origin: true, credentials: true });

  await app.listen(process.env.PORT ?? 4100);
}

bootstrap();
