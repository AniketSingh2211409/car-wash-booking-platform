import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import { motion } from 'framer-motion';

interface Customer {
  id: string;
  name: string;
  phone: string;
  last_visit: string;
  total_visits: number;
  total_spent: number;
}

export default function BusinessCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/business/customers');
      setCustomers(res.data || []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
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

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">
            Customers <span className="text-yellow-500">Dashboard</span>
          </h1>
          <p className="text-gray-400 text-sm">Manage all your customers</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-black border border-gray-800 rounded-lg">
          <p>Total Customers</p>
          <h2 className="text-2xl font-bold">{customers.length}</h2>
        </div>

        <div className="p-4 bg-black border border-gray-800 rounded-lg">
          <p>Avg Visits</p>
          <h2 className="text-2xl font-bold">
            {customers.length
              ? (customers.reduce((a, b) => a + b.total_visits, 0) / customers.length).toFixed(1)
              : 0}
          </h2>
        </div>

        <div className="p-4 bg-black border border-gray-800 rounded-lg">
          <p>Total Revenue</p>
          <h2 className="text-2xl font-bold">
            ₹ {customers.reduce((a, b) => a + Number(b.total_spent || 0), 0)}
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-black border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm">
              <th className="p-4">Customer</th>
              <th className="p-4">Last Visit</th>
              <th className="p-4">Visits</th>
              <th className="p-4 text-right">Spent</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((c, index) => (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-gray-800 hover:bg-white/5"
              >
                <td className="p-4 font-medium">
                  {c.name} <span className="text-gray-400 text-sm">({c.phone})</span>
                </td>

                <td className="p-4 text-gray-400">
                  {c.last_visit
                    ? new Date(c.last_visit).toLocaleDateString()
                    : 'N/A'}
                </td>

                <td className="p-4">{c.total_visits}</td>

                <td className="p-4 text-right text-yellow-500 font-semibold">
                  ₹ {c.total_spent}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}