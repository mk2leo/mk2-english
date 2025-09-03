import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // 获取指定主题的单词
        const { topicId } = req.query;
        if (!topicId) {
          return res.status(400).json({ error: '主题ID不能为空' });
        }
        
        const words = await sql`
          SELECT * FROM words 
          WHERE topic_id = ${topicId} 
          ORDER BY created_at DESC
        `;
        res.status(200).json(words.rows);
        break;

      case 'POST':
        // 添加新单词
        const { topicId: newTopicId, en, zh } = req.body;
        if (!newTopicId || !en) {
          return res.status(400).json({ error: '主题ID和英文单词不能为空' });
        }
        
        const newWord = await sql`
          INSERT INTO words (topic_id, en, zh) 
          VALUES (${newTopicId}, ${en}, ${zh || ''}) 
          RETURNING *
        `;
        res.status(201).json(newWord.rows[0]);
        break;

      case 'DELETE':
        // 删除单词
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: '单词ID不能为空' });
        }
        
        await sql`DELETE FROM words WHERE id = ${id}`;
        res.status(200).json({ message: '单词删除成功' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Words API Error:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
}