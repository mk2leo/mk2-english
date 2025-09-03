import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    // 测试数据库连接
    const result = await sql`SELECT NOW() as current_time, version() as postgres_version`;
    
    res.status(200).json({
      success: true,
      message: '数据库连接成功',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      message: '数据库连接失败',
      error: error.message
    });
  }
}