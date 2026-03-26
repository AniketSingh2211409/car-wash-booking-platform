import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  Save,
  X,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import api from '../../../lib/api';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';

export default function CenterPolicy() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    policy_number: '',
    policy_description: ''
  });

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const response = await api.get('/business/center-policy');
      if (response.data) {
        setFormData({
          policy_number: response.data.policy_number || '',
          policy_description: response.data.policy_description || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch policy:', error);
      toast.error('Failed to load center policy');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/business/center-policy', formData);
      toast.success('Center policy updated successfully');
    } catch (error) {
      toast.error('Failed to update center policy');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-yellow-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white font-sans pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => window.history.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Center Policy</h1>
          <p className="text-white/50 text-sm font-medium">Define your center's terms, conditions, and customer policies</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="glass-card p-10 space-y-10">
          <div className="flex items-center gap-4 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl">
            <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-yellow-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-yellow-500">Policy Configuration</h2>
              <p className="text-white/40 text-xs">These terms will be displayed to customers during booking</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} />
                Policy Number / Reference
              </label>
              <input
                required
                type="text"
                value={formData.policy_number}
                onChange={(e) => setFormData({ ...formData, policy_number: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-yellow-500/50 transition-all text-lg font-medium"
                placeholder="e.g. CP-2024-001"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} />
                Policy Description & Terms
              </label>
              <textarea
                required
                value={formData.policy_description}
                onChange={(e) => setFormData({ ...formData, policy_description: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-yellow-500/50 transition-all h-[400px] resize-none leading-relaxed text-white/80"
                placeholder="Enter your center's policy here. You can include:
- Cancellation terms
- Damage liability
- Personal items policy
- Service guarantees
- Booking requirements"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <button 
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <X size={20} />
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="flex-[2] py-4 bg-yellow-500 text-black rounded-2xl font-bold text-lg hover:bg-yellow-400 transition-all disabled:opacity-30 active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/10"
            >
              {submitting ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  <Save size={20} />
                  Save Policy
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
