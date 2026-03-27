import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';

interface Wash {
  id: number;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  service_name: string;
  car_size: string;
  price: number;
  payment_method: string;
}

export default function WashHistory() {
  const [washes, setWashes] = useState<Wash[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWashes();
  }, []);

  const fetchWashes = async () => {
    try {
      const response = await api.get('/business/washes');
      setWashes(response.data);
    } catch (error) {
      console.error('Failed to fetch washes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWashes = washes.filter((wash) =>
    wash.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wash.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wash.customer_phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-yellow-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">
            Wash <span className="text-yellow-500">History</span>
          </h1>
          <p className="text-white/50 text-xs uppercase tracking-widest">
            Complete record of all service transactions
          </p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-yellow-500/50"
          />
        </div>
      </motion.div>

      {/* List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-hidden border border-white/10 rounded-xl"
      >
        <div className="divide-y divide-white/10">
          <AnimatePresence>
            {filteredWashes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10 text-gray-400"
              >
                No wash history found
              </motion.div>
            ) : (
              filteredWashes.map((wash, index) => (
                <motion.div
                  key={wash.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{wash.service_name}</h3>
                    <p className="text-sm text-gray-400">{wash.customer_name}</p>
                  </div>

                  <div className="text-yellow-500 font-bold">
                    ₹ {wash.price}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}