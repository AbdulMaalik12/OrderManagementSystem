import { ORDER_STATUSES } from '../../utils/constants';

export default function StatusDropdown({ currentStatus, onStatusChange, disabled = false }) {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onStatusChange(e.target.value)}
      disabled={disabled}
      className="input-neon text-xs rounded-lg px-2 py-1.5 cursor-pointer disabled:opacity-40"
      style={{ minWidth: '100px' }}
    >
      {ORDER_STATUSES.map((status) => (
        <option key={status} value={status} style={{ background: '#0d1117', color: '#e2e8f0' }}>
          {status}
        </option>
      ))}
    </select>
  );
}
