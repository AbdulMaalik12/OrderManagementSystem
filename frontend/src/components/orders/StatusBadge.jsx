const BADGE_MAP = {
  Pending:   'badge-pending',
  Confirmed: 'badge-confirmed',
  Shipped:   'badge-shipped',
  Delivered: 'badge-delivered',
  Cancelled: 'badge-cancelled',
};

const DOT_MAP = {
  Pending:   'bg-warning-400',
  Confirmed: 'bg-primary-400',
  Shipped:   'bg-violet-400',
  Delivered: 'bg-success-400',
  Cancelled: 'bg-danger-400',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide ${BADGE_MAP[status] || BADGE_MAP.Pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full pulse-dot ${DOT_MAP[status] || DOT_MAP.Pending}`} />
      {status}
    </span>
  );
}
