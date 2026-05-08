import { useEffect, useRef } from 'react';
import { HiX } from 'react-icons/hi';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2, 8, 23, 0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div className={`gradient-border w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl`}
        style={{ boxShadow: '0 0 60px rgba(99,102,241,0.2), 0 25px 50px rgba(0,0,0,0.8)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary-500/10">
          <h2 className="text-base font-bold text-white tracking-wide" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-dark-300 hover:text-white hover:bg-dark-600/50 transition-all cursor-pointer"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
