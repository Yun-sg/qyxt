import { Pool } from 'pg';

// 你的数据库连接字符串
const connectionString = "postgresql://neondb_owner:npg_vkUdWN08cxqa@ep-damp-pond-amo8xvpa-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({ connectionString });

export default async (req, res) => {
  // 这里的 res 其实不支持 Express 的方法，我们需要用 Netlify 的标准返回方式

  // 1. 处理跨域 (CORS)
  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }

  try {
    // 2. 处理 GET 请求 (读取数据)
    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC');
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(result.rows),
      };
    }

    // 3. 处理 POST 请求 (提交数据)
    if (req.method === 'POST') {
      let body = {};
      try {
        body = JSON.parse(req.body);
      } catch (e) {
        // 如果 body 已经是对象（Netlify 有时会自动解析），则忽略错误
        body = req.body;
      }

      const { content, category } = body;

      if (!content || !category) {
        return {
          statusCode: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ message: '缺少内容或分类' }),
        };
      }

      await pool.query(
        'INSERT INTO feedback (content, category) VALUES ($1, $2) RETURNING *',
        [content, category]
      );

      return {
        statusCode: 201,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: '
