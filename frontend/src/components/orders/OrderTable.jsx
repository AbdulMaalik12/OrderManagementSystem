import StatusBadge from './StatusBadge';
import StatusDropdown from './StatusDropdown';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import EmptyState from '../common/EmptyState';
import { HiOutlineClipboardList } from 'react-icons/hi';

/**
 * Responsive orders table.
 * On mobile: card layout. On desktop: traditional table.
 */
export default function OrderTable({
  orders,
  onEdit,
  onDelete,
  onStatusChange,
  updatingId,
}) {
  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon={HiOutlineClipboardList}
        title="No orders yet"
        description="Create your first order to get started."
      />
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Order #</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Product</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Qty</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Price</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Date</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-surface-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="text-sm font-mono text-primary-600 font-medium">
                    {order.orderNumber}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-surface-800">{order.customerName}</p>
                    <p className="text-xs text-surface-400">{order.phone}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-surface-700">{order.product}</p>
                  {order.size && (
                    <p className="text-xs text-surface-400">Size: {order.size}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-surface-700">{order.quantity}</td>
                <td className="px-4 py-3 text-sm font-medium text-surface-800">
                  {formatCurrency(order.price * order.quantity)}
                </td>
                <td className="px-4 py-3">
                  <StatusDropdown
                    currentStatus={order.status}
                    onStatusChange={(status) => onStatusChange(order._id, status)}
                    disabled={updatingId === order._id}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-surface-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(order)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
                      title="Edit order"
                    >
                      <HiOutlinePencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(order)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"
                      title="Delete order"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl border border-surface-200 p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-primary-600 font-medium">
                  {order.orderNumber}
                </span>
                <p className="text-sm font-medium text-surface-800 mt-0.5">
                  {order.customerName}
                </p>
                <p className="text-xs text-surface-400">{order.phone}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-surface-600">{order.product}</p>
                {order.size && (
                  <p className="text-xs text-surface-400">Size: {order.size} · Qty: {order.quantity}</p>
                )}
                {!order.size && (
                  <p className="text-xs text-surface-400">Qty: {order.quantity}</p>
                )}
              </div>
              <p className="font-semibold text-surface-800">
                {formatCurrency(order.price * order.quantity)}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-surface-100">
              <span className="text-xs text-surface-400">{formatDate(order.createdAt)}</span>
              <div className="flex items-center gap-2">
                <StatusDropdown
                  currentStatus={order.status}
                  onStatusChange={(status) => onStatusChange(order._id, status)}
                  disabled={updatingId === order._id}
                />
                <button
                  onClick={() => onEdit(order)}
                  className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
                >
                  <HiOutlinePencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(order)}
                  className="p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
