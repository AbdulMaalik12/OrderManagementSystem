import { HiSearch } from 'react-icons/hi';
import { ORDER_STATUSES } from '../../utils/constants';

export default function OrderFilters({ search, onSearchChange, status, onStatusChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
        <input
          type="text"
          placeholder="Search by name, phone, or order #..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-neon w-full pl-10 pr-4 py-3 rounded-xl text-sm"
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="input-neon px-4 py-3 rounded-xl text-sm cursor-pointer"
        style={{ minWidth: '150px' }}
      >
        <option value="" style={{ background: '#0d1117' }}>All Statuses</option>
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s} style={{ background: '#0d1117', color: '#e2e8f0' }}>{s}</option>
        ))}
      </select>
    </div>
  );
}
