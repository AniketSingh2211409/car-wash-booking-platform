export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { centerId, date, time } = req.body;

    return res.status(200).json({
      success: true,
      message: 'Booking confirmed',
      booking: { centerId, date, time }
    });
  }

  return res.status(200).json({
    message: 'Bookings API working'
  });
}