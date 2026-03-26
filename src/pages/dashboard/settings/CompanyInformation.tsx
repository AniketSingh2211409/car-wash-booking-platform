import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  Loader2, 
  Save,
  Upload,
  X,
  MapPin,
  Phone,
  Clock,
  Globe,
  Camera,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import api from '../../../lib/api';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';

export default function CompanyInformation() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    cr_number: '',
    tax_number: '',
    map_link: '',
    logo: '',
    images: [] as string[],
    working_hours: '',
    allow_bookings: true
  });

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await api.get('/business/company-info');
      if (response.data) {
        setFormData({
          name: response.data.name || '',
          mobile: response.data.mobile || '',
          cr_number: response.data.cr_number || '',
          tax_number: response.data.tax_number || '',
          map_link: response.data.map_link || '',
          logo: response.data.logo || '',
          images: response.data.images || [],
          working_hours: response.data.working_hours || '',
          allow_bookings: response.data.allow_bookings ?? true
        });
      }
    } catch (error) {
      console.error('Failed to fetch company info:', error);
      toast.error('Failed to load company information');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'images') => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'logo') {
          setFormData(prev => ({ ...prev, logo: base64String }));
        } else {
          setFormData(prev => ({ 
            ...prev, 
            images: [...prev.images, base64String].slice(0, 4) 
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/business/company-info', formData);
      toast.success('Company information updated successfully');
    } catch (error) {
      toast.error('Failed to update company information');
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
          <h1 className="text-3xl font-bold tracking-tight text-white">Company Information</h1>
          <p className="text-white/50 text-sm font-medium">Update your business profile, logo, and contact details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="text-yellow-500" size={20} />
              General Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Company Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    required
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">CR Number</label>
                <input
                  required
                  type="text"
                  value={formData.cr_number}
                  onChange={(e) => setFormData({ ...formData, cr_number: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tax Number</label>
                <input
                  required
                  type="text"
                  value={formData.tax_number}
                  onChange={(e) => setFormData({ ...formData, tax_number: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Google Maps Link</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  required
                  type="url"
                  value={formData.map_link}
                  onChange={(e) => setFormData({ ...formData, map_link: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="text-yellow-500" size={20} />
              Operating Hours & Settings
            </h2>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Working Hours (e.g. 8:00 AM - 10:00 PM)</label>
              <textarea
                value={formData.working_hours}
                onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all h-24 resize-none"
              />
            </div>

            <div 
              className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer"
              onClick={() => setFormData({ ...formData, allow_bookings: !formData.allow_bookings })}
            >
              <div className="flex items-center gap-3">
                <Globe className="text-white/30" size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Allow Online Bookings</span>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full p-1 transition-all",
                formData.allow_bookings ? "bg-yellow-500" : "bg-white/10"
              )}>
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full transition-all",
                  formData.allow_bookings ? "translate-x-6" : "translate-x-0"
                )} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Logo & Images */}
        <div className="space-y-8">
          <div className="glass-card p-8 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Camera className="text-yellow-500" size={20} />
              Company Logo
            </h2>
            
            <div className="flex flex-col items-center gap-6">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-white/5 relative group">
                {formData.logo ? (
                  <>
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, logo: '' })}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={24} />
                    </button>
                  </>
                ) : (
                  <Upload className="text-white/20" size={32} />
                )}
              </div>
              
              <label className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-center cursor-pointer">
                Upload Logo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'logo')} />
              </label>
            </div>
          </div>

          <div className="glass-card p-8 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Upload className="text-yellow-500" size={20} />
              Company Images
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {formData.images.map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden relative group border border-white/10">
                  <img src={img} alt={`Company ${i}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) })}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              {formData.images.length < 4 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all cursor-pointer">
                  <Plus size={24} className="text-white/20" />
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Add Image</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileChange(e, 'images')} />
                </label>
              )}
            </div>
            <p className="text-[10px] text-white/30 text-center uppercase tracking-widest font-bold">Max 4 images</p>
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-bold text-lg hover:bg-yellow-400 transition-all disabled:opacity-30 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
