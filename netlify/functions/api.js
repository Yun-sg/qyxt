import { Pool } from 'pg';

// 👇 在下面双引号里粘贴你的数据库地址
const connectionString = "postgresql://neondb_owner:npg_vkUdWN08cxqa@ep-damp-pond-amo8xvpa-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({ connectionString });

export default async (req, res) => {
  // 允许跨域（让网页能访问）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // 获取所有意见
      const result = await pool.query('SELECT * FROM feedbacks ORDER BY created_at DESC');
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      // 提交新意见
      const { content, category } = req.body;
      const result = await pool.query(
        'INSERT INTO feedbacks (content, category) VALUES ($1, $2) RETURNING *',
        [content, category]
      );
      return res.status(200).json(result.rows[0]);
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '服务器错误', error: error.message });
  }
};