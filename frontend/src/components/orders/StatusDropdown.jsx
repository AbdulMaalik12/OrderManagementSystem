import { ORDER_STATUSES } from '../../utils/constants';

/**
 * Dropdown to quickly change an order's status.
 */
export default function StatusDropdown({ currentStatus, onStatusChange, disabled = false }) {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onStatusChange(e.target.value)}
      disabled={disabled}
      className="px-2 py-1 text-xs rounded-lg border border-surface-300 bg-white
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
        hover:border-surface-400 transition-colors cursor-pointer disabled:opacity-50"
    >
      {ORDER_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
