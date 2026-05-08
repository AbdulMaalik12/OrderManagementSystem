import { useAuth } from '../../context/AuthContext';
import { HiOutlineMenu, HiOutlineLogout, HiOutlineUser, HiOutlineBell } from 'react-icons/hi';
import { useState, useRef, useEffect } from 'react';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 shrink-0"
      style={{ background: 'rgba(5,8,22,0.8)', borderBottom: '1px solid rgba(99,102,241,0.1)', backdropFilter: 'blur(20px)' }}>

      {/* Left: hamburger (mobile) */}
      <button onClick={onMenuClick}
        className="p-2 rounded-xl text-dark-300 hover:text-white hover:bg-dark-600/50 md:hidden cursor-pointer transition-all">
        <HiOutlineMenu className="w-5 h-5" />
      </button>

      {/* Left desktop: breadcrumb-style */}
      <div className="hidden md:flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary-500 pulse-dot" />
        <span className="text-xs text-dark-300 font-medium tracking-wide">ORDERFLOW</span>
        <span className="text-dark-500">/</span>
        <span className="text-xs text-dark-200 font-medium">Dashboard</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-2 rounded-xl text-dark-300 hover:text-white hover:bg-dark-600/50 cursor-pointer transition-all">
          <HiOutlineBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary-400"
            style={{ boxShadow: '0 0 6px rgba(99,102,241,0.8)' }} />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer hover:bg-dark-600/50"
            style={{ border: '1px solid rgba(99,102,241,0.15)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 0 12px rgba(99,102,241,0.4)' }}>
              <span className="text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-none">{user?.name || 'User'}</p>
              <p className="text-[10px] text-dark-300 mt-0.5">{user?.businessName || 'Seller'}</p>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-success-400 hidden sm:block"
              style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl py-2 z-50"
              style={{ background: 'rgba(5,8,22,0.95)', border: '1px solid rgba(99,102,241,0.2)', backdropFilter: 'blur(20px)', boxShadow: '0 0 40px rgba(99,102,241,0.15), 0 20px 40px rgba(0,0,0,0.6)' }}>
              <div className="px-4 py-3 border-b border-primary-500/10">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-dark-300 mt-0.5">{user?.email}</p>
                {user?.businessName && (
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium text-primary-300"
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    {user.businessName}
                  </span>
                )}
              </div>
              <button onClick={() => { setDropdownOpen(false); logout(); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger-400 hover:text-danger-300 hover:bg-danger-500/10 transition-all cursor-pointer mt-1">
                <HiOutlineLogout className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
