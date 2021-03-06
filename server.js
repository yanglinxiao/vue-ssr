const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');

const { createBundleRenderer } = require('vue-server-renderer')

const app = new Koa();
const router = new Router();

const LRU = require("lru-cache");

// 设置静态资源访问路径
app.use(static(path.resolve(__dirname, './dist')));

// 服务端渲染的html模板
const template = fs.readFileSync('./public/index.server.html', 'utf-8');
// 服务端渲染的bundle
const serverBundle = require('./dist/vue-ssr-server-bundle.json');
// 客户端manifest.json，存着前端的bundle，用来给服务端的bundle注水(hydrate)
const clientManifest = require('./dist/vue-ssr-client-manifest.json');

// 生成渲染器
const render = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template,
  clientManifest
});

const microCache = new LRU({
  max: 100,
  maxAge: 10000 // 重要提示：条目在 1 秒后过期。
})

const isCacheable = ctx => {
  // 实现逻辑为，检查请求是否是用户特定(user-specific)。
  // 只有非用户特定 (non-user-specific) 页面才会缓存
  return ctx.url === '/foo';
}

router.get('*', async ctx => {
  const cacheable = isCacheable(ctx)
  if (cacheable) {
    const hit = microCache.get(ctx.url)
    if (hit) {
      console.log(`命中缓存`);
      return ctx.body = hit;
    }
  }

  const context = { url: ctx.url };
  try {
    const html = await render.renderToString(context);
    ctx.body = html;
    if (cacheable) {
      microCache.set(ctx.url, html)
    }
  } catch (err) {
    if (err.code === 404) {
      ctx.status = 404;
      ctx.body = 'Page not found';
    } else {
      ctx.status = 500;
      ctx.body ='Internal Server Error';
    }
  }
});

// 调用router.routes()来组装匹配好的路由，返回一个合并好的中间件
app.use(router.routes());

// 调用router.allowedMethods()获得一个中间件，当发送了不符合的请求时，会返回 `405 Method Not Allowed` 或 `501 Not Implemented`
app.use(router.allowedMethods({
  // throw: true, // 抛出错误，代替设置响应头状态
  // notImplemented: () => '不支持当前请求所需要的功能',
  // methodNotAllowed: () => '不支持的请求方式'
}));

app.listen(3001);