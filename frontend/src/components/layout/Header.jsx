import { useAuth } from '../../context/AuthContext';
import { HiOutlineMenu, HiOutlineLogout, HiOutlineUser } from 'react-icons/hi';
import { useState, useRef, useEffect } from 'react';

/**
 * Top header bar with hamburger menu and user dropdown.
 */
export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
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
    <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-4 md:px-6">
      {/* Left: hamburger menu (mobile) */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 md:hidden cursor-pointer"
      >
        <HiOutlineMenu className="w-5 h-5" />
      </button>

      {/* Spacer for desktop */}
      <div className="hidden md:block" />

      {/* Right: user menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-100 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <HiOutlineUser className="w-4 h-4 text-primary-600" />
          </div>
          <span className="text-sm font-medium text-surface-700 hidden sm:block">
            {user?.name || 'User'}
          </span>
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-surface-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-surface-100">
              <p className="text-sm font-medium text-surface-800">{user?.name}</p>
              <p className="text-xs text-surface-400">{user?.email}</p>
              {user?.businessName && (
                <p className="text-xs text-primary-500 mt-0.5">{user.businessName}</p>
              )}
            </div>
            <button
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"
            >
              <HiOutlineLogout className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
