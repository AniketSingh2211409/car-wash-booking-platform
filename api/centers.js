export default async function handler(req, res) {
  res.status(200).json([
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
}