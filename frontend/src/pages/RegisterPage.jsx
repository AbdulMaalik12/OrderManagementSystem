import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', businessName: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const data = await register(formData);
      if (data.success) { toast.success('Account created!'); navigate('/dashboard'); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-animated grid-pattern">
      <div className="fixed top-1/3 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 relative float"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 0 40px rgba(99,102,241,0.5)' }}>
            <span className="text-white text-2xl font-black" style={{ fontFamily: "'Exo 2', sans-serif" }}>OF</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            Create <span style={{ color: '#818cf8' }}>Account</span>
          </h1>
          <p className="text-sm text-dark-300">Start managing your orders like a pro</p>
        </div>

        <div className="gradient-border p-6" style={{ boxShadow: '0 0 60px rgba(99,102,241,0.1), 0 25px 50px rgba(0,0,0,0.5)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" name="name" value={formData.name} onChange={handleChange}
                placeholder="Ahmed Khan" required className="col-span-2 sm:col-span-1" />
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="0300 1234567" className="col-span-2 sm:col-span-1" />
            </div>
            <Input label="Email Address" name="email" type="email" value={formData.email}
              onChange={handleChange} placeholder="you@example.com" required />
            <Input label="Password" name="password" type="password" value={formData.password}
              onChange={handleChange} placeholder="Min. 6 characters" required />
            <Input label="Business Name" name="businessName" value={formData.businessName}
              onChange={handleChange} placeholder="e.g. Fashion Hub Lahore (optional)" />
            <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-dark-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
            Sign In →
          </Link>
        </p>
      </div>
    </div>
  );
}
