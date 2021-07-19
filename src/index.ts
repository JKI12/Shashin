import Koa, { Context, Next } from 'koa';
import Router from 'koa-router';

import logger from './logger';
import defaultImage from './utils/default-image';
import isValidUrl from './utils/is-valid-url';
import screenshot from './utils/screenshot';

const app = new Koa();

const router = new Router();

const timingMiddleware = async (ctx: Context, next: Next) => {
  ctx.tracing = {
    start: new Date().valueOf()
  };

  await next();
  
  if (ctx.response.status === 200) {
    const { url } = ctx.request.query;
    const { start } = ctx.tracing;
    const end = new Date().valueOf();
    const timing = (end - start) / 1000;

    logger.info(`Screenshot: ${url} | Timing: ${timing} seconds`, {
      timing
    });
  }
};

const errorMiddleware = async (ctx: Context, next: Next) => {
  await next();

  if (ctx.response.status != 200) {
    if (ctx.response.body && (ctx.response.body as any).error) {
      logger.error((ctx.response.body as any).error, { res: ctx.res });
    } else {
      logger.error({ res: ctx.res });
    }
  }
}

router.get('/', ctx => ctx.body = { ping: true });

router.get('/screenshot', timingMiddleware, errorMiddleware, async ctx => {
  const { url } = ctx.request.query;

  if (!url) {
    ctx.status = 400;
    ctx.body = {
      error: 'No url provided'
    };
    return;
  } else if (Array.isArray(url)) {
    ctx.status = 400;
    ctx.body = {
      error: 'Only 1 url can be provided'
    };
    return;
  }

  const webUrl = url as string;

  if (!isValidUrl(webUrl)) {
    ctx.status = 400;
    ctx.body = {
      error: 'Url is not valid'
    };
    return;
  }

  ctx.set('Content-Type', 'image/png');

  try {
    ctx.response.body = await screenshot(url);
  } catch (error) {
    logger.error('Failed to take screenshot', { err: error });
    ctx.response.body = await defaultImage();
  }
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(port, () => {
  logger.info(`Listening on port: ${port}`);
})