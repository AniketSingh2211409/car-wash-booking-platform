import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const result = await pool.query(`SELECT * FROM businesses WHERE status = 'approved' ORDER BY created_at DESC`);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Centers error:', err);
    return res.status(200).json([]);
  }
}
