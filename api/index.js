// api/index.js

// 1. 引入 express 和 serverless-http
// 注意：这里必须用 require，不能用 import
const express = require('express');
const serverless = require('serverless-http');

// 2. 创建 express 实例
const app = express();
const router = express.Router();

// 3. 定义一个简单的 GET 接口
// 当你访问 https://你的网址.netlify.app/api/ 时，会触发这个
router.get('/', (req, res) => {
  res.json({
    code: 200,
    message: 'Hello! 后端系统已启动！',
    timestamp: Date.now()
  });
});

// 4. 定义一个测试 POST 接口
router.post('/test', (req, res) => {
  res.json({
    code: 200,
    message: '收到 POST 请求！'
  });
});

// 5. 把路由挂载到 app 上
// 注意：Netlify 会自动把 /api 映射到这里，所以这里用 '/' 即可
app.use('/', router);

// 6. 导出 handler
// 这是 Netlify 识别函数的关键
module.exports.handler = serverless(app);