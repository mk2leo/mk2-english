import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // 获取所有主题
        const topics = await sql`SELECT * FROM topics ORDER BY created_at DESC`;
        res.status(200).json(topics.rows);
        break;

      case 'POST':
        // 创建新主题
        const { name } = req.body;
        if (!name) {
          return res.status(400).json({ error: '主题名称不能为空' });
        }
        
        const newTopic = await sql`
          INSERT INTO topics (name) 
          VALUES (${name}) 
          RETURNING *
        `;
        res.status(201).json(newTopic.rows[0]);
        break;

      case 'DELETE':
        // 删除主题
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: '主题ID不能为空' });
        }
        
        await sql`DELETE FROM topics WHERE id = ${id}`;
        res.status(200).json({ message: '主题删除成功' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Topics API Error:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
}