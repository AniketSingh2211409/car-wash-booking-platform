import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Users, 
  ArrowLeft, 
  Loader2, 
  X,
  Shield,
  Phone,
  User,
  Building2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../../lib/api';
import { cn } from '../../../lib/utils';
import toast from 'react-hot-toast';

interface BusinessUser {
  id: number;
  full_name: string;
  username: string;
  phone: string;
  account_type: string;
  branch_names: string[];
  permissions: string[];
}

interface Branch {
  id: number;
  name: string;
}

const ALL_PERMISSIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'sales', label: 'Sales' },
  { id: 'purchases', label: 'Purchases' },
  { id: 'settings', label: 'Settings' },
  { id: 'requests', label: 'Pending Requests' }
];

export default function AdminUserManagement() {
  const [users, setUsers] = useState<BusinessUser[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    phone: '',
    password: '',
    account_type: 'staff',
    branch_ids: [] as number[],
    permissions: [] as string[]
  });

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/business/business-users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await api.get('/business/branches');
      setBranches(response.data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/business/business-users/${editingId}`, formData);
        toast.success('User updated successfully');
      } else {
        await api.post('/business/business-users', formData);
        toast.success('User added successfully');
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({
        full_name: '',
        username: '',
        phone: '',
        password: '',
        account_type: 'staff',
        branch_ids: [],
        permissions: []
      });
      fetchUsers();
    } catch (error) {
      toast.error('Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setFormData({
      full_name: user.full_name,
      username: user.username,
      phone: user.phone,
      password: '', // Don't pre-fill password
      account_type: user.account_type,
      branch_ids: user.branch_ids || [],
      permissions: user.permissions || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/business/business-users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-8 text-white font-sans pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Administrator Management</h1>
            <p className="text-white/50 text-sm font-medium">Manage user accounts and permissions for your staff</p>
          </div>
        </div>

        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({
              full_name: '',
              username: '',
              phone: '',
              password: '',
              account_type: 'staff',
              branch_ids: [],
              permissions: []
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 text-black rounded-full font-bold text-sm hover:bg-yellow-400 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Users List */}
      <div className="glass-card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Full Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Username</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Phone</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Branches</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin text-yellow-500 mx-auto" size={32} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-white/20">
                      <Users size={48} />
                      <p className="text-sm font-bold uppercase tracking-widest">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold">{user.full_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white/60 text-sm">@{user.username}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white/60 text-sm">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.branch_names.map((name, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-white/60">
                            {name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter",
                        user.account_type === 'admin' ? "bg-yellow-500 text-black" : "bg-white/10 text-white/60"
                      )}>
                        {user.account_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-white/5">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin text-yellow-500 mx-auto" size={32} />
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4 text-white/20">
                <Users size={48} />
                <p className="text-sm font-bold uppercase tracking-widest">No users found</p>
              </div>
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{user.full_name}</div>
                    <div className="text-white/40 text-xs">@{user.username}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Type</p>
                    <span className={cn(
                      "inline-block px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter",
                      user.account_type === 'admin' ? "bg-yellow-500 text-black" : "bg-white/10 text-white/60"
                    )}>
                      {user.account_type}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Phone</p>
                    <p className="text-sm font-bold">{user.phone}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Branches</p>
                    <div className="flex flex-wrap gap-1">
                      {user.branch_names.map((name, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-white/60">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-bold">{editingId ? 'Edit User' : 'Add New User'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input
                        required
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Username</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input
                        required
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                        placeholder="e.g. john_doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input
                        required
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                        placeholder="+966 50 000 0000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Password {editingId && '(Leave blank to keep current)'}</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input
                        required={!editingId}
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-yellow-500/50 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Assigned Branches</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {branches.map(branch => (
                      <div 
                        key={branch.id}
                        onClick={() => {
                          const newIds = formData.branch_ids.includes(branch.id)
                            ? formData.branch_ids.filter(id => id !== branch.id)
                            : [...formData.branch_ids, branch.id];
                          setFormData({ ...formData, branch_ids: newIds });
                        }}
                        className={cn(
                          "p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2",
                          formData.branch_ids.includes(branch.id)
                            ? "bg-yellow-500/10 border-yellow-500 text-yellow-500"
                            : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                        )}
                      >
                        <Building2 size={14} />
                        <span className="text-xs font-bold">{branch.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Permissions</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ALL_PERMISSIONS.map(permission => (
                      <div 
                        key={permission.id}
                        onClick={() => {
                          const newPerms = formData.permissions.includes(permission.id)
                            ? formData.permissions.filter(p => p !== permission.id)
                            : [...formData.permissions, permission.id];
                          setFormData({ ...formData, permissions: newPerms });
                        }}
                        className={cn(
                          "p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between",
                          formData.permissions.includes(permission.id)
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                            : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                        )}
                      >
                        <span className="text-xs font-bold uppercase tracking-widest">{permission.label}</span>
                        <div className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                          formData.permissions.includes(permission.id) ? "bg-emerald-500 border-emerald-500" : "border-white/20"
                        )}>
                          {formData.permissions.includes(permission.id) && <Shield size={10} className="text-white" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-bold text-lg hover:bg-yellow-400 transition-all disabled:opacity-30 active:scale-[0.98]"
                >
                  {submitting ? <Loader2 className="animate-spin mx-auto" size={24} /> : editingId ? 'Update User' : 'Add User'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
