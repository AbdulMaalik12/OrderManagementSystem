import { HiSearch } from 'react-icons/hi';
import { ORDER_STATUSES } from '../../utils/constants';

/**
 * Filter bar for orders — search input + status filter dropdown.
 */
export default function OrderFilters({ search, onSearchChange, status, onStatusChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="text"
          placeholder="Search by name, phone, or order #..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-surface-300 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            hover:border-surface-400 transition-colors placeholder:text-surface-400"
        />
      </div>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-surface-300 text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          hover:border-surface-400 transition-colors cursor-pointer"
      >
        <option value="">All Statuses</option>
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
