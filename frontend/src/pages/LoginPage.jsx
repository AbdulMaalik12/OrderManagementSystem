import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

/**
 * Login page.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(formData);
      if (data.success) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-xl mb-4">
            <span className="text-white text-lg font-bold">OM</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-800">Welcome back</h1>
          <p className="text-surface-500 mt-1">Sign in to manage your orders</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <Button type="submit" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-surface-500 mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
