import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import type { Request, Response } from 'express';

async function createApp(expressInstance: express.Express) {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.init();
  return app;
}

// ── Vercel serverless handler ─────────────────────────────────────────────
let cachedExpressApp: express.Express | null = null;

async function getExpressApp() {
  if (!cachedExpressApp) {
    const server = express();
    await createApp(server);
    cachedExpressApp = server;
  }
  return cachedExpressApp;
}

module.exports = async (req: Request, res: Response) => {
  const app = await getExpressApp();
  app(req, res);
};

// ── Local dev ─────────────────────────────────────────────────────────────
if (!process.env.VERCEL) {
  const server = express();
  createApp(server).then(() => {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  });
}
