import { NavLink } from 'react-router-dom';
import { HiOutlineViewGrid, HiOutlineClipboardList, HiOutlineX } from 'react-icons/hi';
import { HiMiniBoltSlash } from 'react-icons/hi2';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
  { to: '/orders', label: 'Orders', icon: HiOutlineClipboardList },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ background: 'rgba(2,8,23,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={onClose} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col
        transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'rgba(5, 8, 22, 0.95)', borderRight: '1px solid rgba(99,102,241,0.15)', backdropFilter: 'blur(20px)' }}>

        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 shrink-0"
          style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center relative"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}>
              <span className="text-white text-sm font-black">OF</span>
              <div className="absolute inset-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15))', borderRadius: 'inherit' }} />
            </div>
            <div>
              <span className="font-black text-white text-lg tracking-tight" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                Order<span className="text-primary-400">Flow</span>
              </span>
              <div className="text-[9px] text-primary-400/60 tracking-[3px] uppercase font-medium -mt-0.5">Enterprise</div>
            </div>
          </div>
          <button onClick={onClose}
            className="p-1 rounded-lg text-dark-300 hover:text-white md:hidden cursor-pointer transition-colors">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Nav label */}
        <div className="px-5 pt-6 pb-2">
          <span className="text-[9px] font-bold text-dark-400 uppercase tracking-[3px]">Navigation</span>
        </div>

        {/* Nav items */}
        <nav className="px-3 space-y-1 flex-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive ? 'nav-active' : 'text-dark-300 hover:text-white hover:bg-dark-600/30'
                }`
              }>
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-primary-500/20' : 'group-hover:bg-dark-500/30'}`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary-400' : 'text-dark-300 group-hover:text-white'}`} />
                  </div>
                  <span>{label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 pulse-dot" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom status */}
        <div className="p-4 m-3 rounded-xl shrink-0"
          style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success-400 pulse-dot" />
            <span className="text-xs text-dark-200">System Online</span>
          </div>
          <p className="text-[10px] text-dark-400 mt-1">All services operational</p>
        </div>
      </aside>
    </>
  );
}
