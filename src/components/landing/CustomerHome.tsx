import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useLanguage } from '../../contexts/LanguageContext';

export const CustomerHome = ({
  audience = 'INDIVIDUALS',
  setAudience,
  onOpenLogin,
  searchQuery = ''
}: any) => {

  const { language: lang } = useLanguage();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isRtl = lang === 'ar';

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await api.get('/centers');
        setBusinesses(response.data || []);
      } catch {
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const handleBooking = async (centerId: number) => {
    const date = prompt("Enter date (YYYY-MM-DD)");
    const time = prompt("Enter time (HH:MM)");

    if (!date || !time) return;

    try {
      await api.post('/bookings', {
        centerId,
        date,
        time
      });

      alert('Booking Successful 🚀');
    } catch {
      alert('Booking Failed ❌');
    }
  };

  const filteredBusinesses = businesses.filter(b =>
    (b.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (b.address?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const isCurrentlyOpen = (workingHours: string) => {
    if (!workingHours) return true;

    try {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const match = workingHours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);

      if (match) {
        const start = parseInt(match[1]) * 60 + parseInt(match[2]);
        const end = parseInt(match[3]) * 60 + parseInt(match[4]);

        if (end < start) return currentTime >= start || currentTime <= end;
        return currentTime >= start && currentTime <= end;
      }
    } catch {}

    return true;
  };

  return (
    <div className="space-y-32 pb-32 mt-24">
      {audience === 'INDIVIDUALS' && (
        <section className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">
            Nearby Centers
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <p className="text-white">Loading...</p>
            ) : filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((center) => (
                <div key={center.id} className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-white font-bold">
                    {center.name}
                  </h3>

                  <p className="text-gray-400">
                    {center.address}
                  </p>

                  <p className="text-sm text-gray-500">
                    {center.working_hours}
                  </p>

                  <div className="mt-2">
                    {isCurrentlyOpen(center.working_hours) ? (
                      <span className="text-green-500 text-sm">Open</span>
                    ) : (
                      <span className="text-red-500 text-sm">Closed</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleBooking(center.id)}
                    className="mt-4 text-yellow-400"
                  >
                    Book Now →
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                No centers available
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};