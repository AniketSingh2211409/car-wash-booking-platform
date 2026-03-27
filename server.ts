import express from 'express';
import cors from 'cors';

const app = express();

// ✅ CORS FIX (IMPORTANT)
app.use(cors({
  origin: "*", // deploy ke liye open rakho (baad me restrict kar sakte ho)
  credentials: true
}));

app.use(express.json());

// Dummy DB
let businesses = [
  {
    id: "1",
    name: "Premium Car Wash",
    owner_name: "Rahul",
    phone: "9999999999",
    status: "pending",
    commission_rate: 10,
    address: "Delhi",
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Speed Wash Center",
    owner_name: "Amit",
    phone: "8888888888",
    status: "approved",
    commission_rate: 15,
    address: "Noida",
    created_at: new Date().toISOString()
  }
];

// ✅ APIs

app.get('/api/centers', (req, res) => {
  res.json([
    {
      id: 1,
      name: "Premium Car Wash",
      address: "Delhi",
      working_hours: "09:00 - 21:00"
    },
    {
      id: 2,
      name: "Speed Wash Center",
      address: "Noida",
      working_hours: "10:00 - 20:00"
    }
  ]);
});

app.post('/api/bookings', (req, res) => {
  const { centerId, date, time } = req.body;

  res.json({
    success: true,
    message: 'Booking confirmed',
    booking: { centerId, date, time }
  });
});

app.get('/api/bookings', (req, res) => {
  res.json({ message: 'Bookings API working' });
});

app.get('/api/admin/businesses', (req, res) => {
  res.json(businesses);
});

app.put('/api/admin/businesses', (req, res) => {
  const { id, status, commission_rate } = req.body;

  businesses = businesses.map(b => {
    if (b.id === id) {
      return {
        ...b,
        status: status || b.status,
        commission_rate: commission_rate ?? b.commission_rate
      };
    }
    return b;
  });

  res.json({ success: true });
});

// ✅ ROOT ROUTE (health check)
app.get('/', (req, res) => {
  res.send("Backend running 🚀");
});

// ✅ PORT FIX (VERY IMPORTANT)
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});