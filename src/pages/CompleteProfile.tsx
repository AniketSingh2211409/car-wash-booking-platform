import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    phone: '',
    car_info: '',
    role: 'customer' as 'customer' | 'business_owner',
    businessName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const user = res.data;
      setFormData(prev => ({
        ...prev,
        phone: user.phone || '',
        car_info: user.car_info || '',
        role: user.role || 'customer'
      }));
      setLoading(false);
    }).catch(() => {
      navigate('/login');
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/auth/complete-profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (formData.role === 'business_owner') {
        navigate('/login?message=pending_approval');
      } else {
        navigate('/customer');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete profile');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <h2 className="text-3xl font-bold text-center">Complete Your Profile</h2>
        <p className="text-zinc-400 text-center text-sm">We need a few more details to set up your account.</p>
        
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="e.g. +1234567890"
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">I am a...</label>
            <select
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            >
              <option value="customer">Customer</option>
              <option value="business_owner">Business Owner</option>
            </select>
          </div>

          {formData.role === 'customer' ? (
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Car Information (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Toyota Camry 2022"
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg"
                value={formData.car_info}
                onChange={(e) => setFormData({ ...formData, car_info: e.target.value })}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Business Name</label>
              <input
                type="text"
                placeholder="e.g. Sparkle Car Wash"
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
              />
            </div>
          )}

          <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors">
            Finish Setup
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
