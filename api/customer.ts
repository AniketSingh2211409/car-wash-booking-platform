import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from './_db.js';
import { verifyToken, AuthenticatedRequest } from './_auth.js';
import { createNotification } from './_notifications_helper.js';

export default async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!verifyToken(req, res)) return;

  const url = req.url || '';
  const userId = req.user!.id;

  // Ensure gift_cards table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS gift_cards (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      business_id UUID REFERENCES businesses(id),
      service_id UUID REFERENCES services(id),
      code VARCHAR(20) UNIQUE NOT NULL,
      type VARCHAR(20) NOT NULL, -- 'cash' or 'service'
      initial_value DECIMAL(10, 2) NOT NULL,
      current_balance DECIMAL(10, 2) NOT NULL,
      expiry_date TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // GET /api/customer/gift-cards
  if (url.includes('/gift-cards') && req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT gc.*, s.name_en as service_name, b.name as business_name
        FROM gift_cards gc
        LEFT JOIN services s ON gc.service_id = s.id
        LEFT JOIN businesses b ON gc.business_id = b.id
        WHERE gc.user_id = $1
        ORDER BY gc.created_at DESC
      `, [userId]);
      return res.json(result.rows);
    } catch (error) {
      console.error('Error fetching gift cards:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // POST /api/customer/gift-cards/purchase
  if (url.includes('/gift-cards/purchase') && req.method === 'POST') {
    try {
      const { type, amount, service_id, business_id } = req.body;
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const result = await pool.query(
        'INSERT INTO gift_cards (user_id, business_id, service_id, code, type, initial_value, current_balance, expiry_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [userId, business_id || null, service_id || null, code, type, amount, amount, expiryDate]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error purchasing gift card:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // GET /api/customer/profile
  if (url.includes('/profile') && req.method === 'GET') {
    try {
      const result = await pool.query('SELECT id, name, phone, email, car_info FROM users WHERE id = $1', [userId]);
      if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
      return res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // PUT /api/customer/profile
  if (url.includes('/profile') && req.method === 'PUT') {
    try {
      const { name, phone, email, car_info } = req.body;
      const result = await pool.query(
        'UPDATE users SET name = $1, phone = $2, email = $3, car_info = $4 WHERE id = $5 RETURNING id, name, phone, email, car_info',
        [name, phone, email, car_info, userId]
      );
      return res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // GET /api/customer/history
  if (url.includes('/history') && req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT w.*, b.name as business_name, s.name_en as service_name
        FROM washes w
        LEFT JOIN businesses b ON w.business_id = b.id
        LEFT JOIN services s ON w.service_id = s.id
        WHERE w.customer_id = $1
        ORDER BY w.created_at DESC
      `, [userId]);
      return res.json(result.rows);
    } catch (error) {
      console.error('Error fetching history:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // GET /api/customer/subscription
  if (url.includes('/subscription') && req.method === 'GET') {
    try {
      // Check if table exists
      const tablesRes = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'customer_subscriptions'");
      if (tablesRes.rows.length === 0) {
        console.log('Customer Subscriptions: Table customer_subscriptions does not exist');
        return res.json(null);
      }

      const result = await pool.query(`
        SELECT cs.*, s.name_en as plan_name, b.name as business_name
        FROM customer_subscriptions cs
        LEFT JOIN subscriptions s ON cs.subscription_id = s.id
        LEFT JOIN businesses b ON s.business_id = b.id
        WHERE cs.user_id = $1 AND cs.status = 'active'
        ORDER BY cs.created_at DESC
        LIMIT 1
      `, [userId]);
      
      console.log('Customer Subscriptions: Found:', result.rows.length);
      return res.json(result.rows[0] || null);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return res.json(null); // Return null instead of crashing if requested
    }
  }

  // GET /api/customer/plans
  if (url.includes('/plans') && req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT s.*, b.name as business_name
        FROM subscriptions s
        LEFT JOIN businesses b ON s.business_id = b.id
        WHERE s.active = true AND b.status = 'approved'
      `);
      return res.json(result.rows);
    } catch (error) {
      console.error('Error fetching plans:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // GET /api/customer/centers/:id
  const centerMatch = url.match(/\/centers\/([a-f0-9-]+)/);
  if (centerMatch && req.method === 'GET') {
    try {
      const id = centerMatch[1];
      const result = await pool.query(`
        SELECT b.id, b.name, b.address, b.status,
          COALESCE((SELECT json_agg(s.*) FROM services s WHERE s.business_id = b.id AND s.active = true), '[]') as services,
          COALESCE((SELECT json_agg(sub.*) FROM subscriptions sub WHERE sub.business_id = b.id AND sub.active = true), '[]') as subscriptions
        FROM businesses b
        WHERE b.id = $1 AND b.status = 'approved'
      `, [id]);
      
      if (result.rows.length === 0) return res.status(404).json({ message: 'Center not found' });
      return res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching center details:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // GET /api/customer/centers
  if (url.endsWith('/centers') && req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT b.id, b.name, b.address, b.status,
          COALESCE((SELECT json_agg(s.*) FROM services s WHERE s.business_id = b.id AND s.active = true), '[]') as services,
          COALESCE((SELECT json_agg(sub.*) FROM subscriptions sub WHERE sub.business_id = b.id AND sub.active = true), '[]') as subscriptions
        FROM businesses b
        WHERE b.status = 'approved'
      `);
      return res.json(result.rows);
    } catch (error) {
      console.error('Error fetching centers:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // POST /api/customer/requests
  if (url.includes('/requests') && req.method === 'POST') {
    try {
      const { business_id, service_id, date, time } = req.body;

      // Get customer info for car size
      const userRes = await pool.query('SELECT name, car_info FROM users WHERE id = $1', [userId]);
      const carInfo = userRes.rows[0]?.car_info || {};
      const carSize = (carInfo.size || 'medium').toLowerCase();
      const userName = userRes.rows[0]?.name || 'A customer';

      // Get service info for price
      const serviceRes = await pool.query('SELECT name_en, price, price_small, price_medium, price_suv FROM services WHERE id = $1', [service_id]);
      if (serviceRes.rows.length === 0) return res.status(404).json({ message: 'Service not found' });
      
      const service = serviceRes.rows[0];
      let price = service.price || service.price_medium;
      if (carSize === 'small') price = service.price_small || price;
      if (carSize === 'suv') price = service.price_suv || price;

      // Insert request - using user_id as per schema
      const result = await pool.query(
        'INSERT INTO service_requests (user_id, business_id, service_id, request_date, request_time, price, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
        [userId, business_id, service_id, date || null, time || null, price, 'pending']
      );

      // Notify business owner
      const ownerRes = await pool.query('SELECT id FROM users WHERE business_id = $1 AND role = $2', [business_id, 'business_owner']);
      if (ownerRes.rows.length > 0) {
        const serviceName = service.name_en || 'Service';
        
        await createNotification({
          userId: ownerRes.rows[0].id,
          businessId: business_id,
          title: 'New Service Request',
          message: `New service request from ${userName} for ${serviceName}.`,
          type: 'service_request',
          link: '/dashboard/requests'
        });
      }

      return res.json({ success: true, message: 'Request sent successfully', request: result.rows[0] });
    } catch (error) {
      console.error('Error creating request:', error);
      return res.status(500).json({ success: false, message: 'Failed to send request. Please try again.' });
    }
  }

  return res.status(404).json({ message: 'Not found' });
}
