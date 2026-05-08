import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(formData);
      if (data.success) { toast.success('Welcome back!'); navigate('/dashboard'); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-animated grid-pattern">
      {/* Ambient orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 relative float"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 0 40px rgba(99,102,241,0.5), 0 0 80px rgba(99,102,241,0.2)' }}>
            <span className="text-white text-2xl font-black" style={{ fontFamily: "'Exo 2', sans-serif" }}>OF</span>
            <div className="absolute inset-0 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15))' }} />
          </div>
          <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            Welcome <span className="text-glow" style={{ color: '#818cf8' }}>Back</span>
          </h1>
          <p className="text-sm text-dark-300">Sign in to your order management system</p>
        </div>

        {/* Form */}
        <div className="gradient-border p-6" style={{ boxShadow: '0 0 60px rgba(99,102,241,0.1), 0 25px 50px rgba(0,0,0,0.5)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email Address" name="email" type="email" value={formData.email}
              onChange={handleChange} placeholder="you@example.com" required />
            <Input label="Password" name="password" type="password" value={formData.password}
              onChange={handleChange} placeholder="••••••••" required />
            <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-dark-400 mt-6">
          New here?{' '}
          <Link to="/register" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
            Create Account →
          </Link>
        </p>
      </div>
    </div>
  );
}
