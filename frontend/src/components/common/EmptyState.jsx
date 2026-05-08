import { HiOutlineInbox } from 'react-icons/hi';

/**
 * Empty state placeholder component.
 */
export default function EmptyState({
  icon: Icon = HiOutlineInbox,
  title = 'No data found',
  description = '',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Icon className="w-16 h-16 text-surface-300 mb-4" />
      <h3 className="text-lg font-medium text-surface-600 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-surface-400 mb-4 max-w-sm">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
