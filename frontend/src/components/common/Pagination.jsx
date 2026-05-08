import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-xs text-dark-400">
        Page <span className="text-white font-semibold">{currentPage}</span> of{' '}
        <span className="text-white font-semibold">{totalPages}</span>
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl text-dark-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
          style={{ border: '1px solid rgba(99,102,241,0.15)', background: 'rgba(13,17,31,0.5)' }}>
          <HiChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl text-dark-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
          style={{ border: '1px solid rgba(99,102,241,0.15)', background: 'rgba(13,17,31,0.5)' }}>
          <HiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
