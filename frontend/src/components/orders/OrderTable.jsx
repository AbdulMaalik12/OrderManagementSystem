import StatusBadge from './StatusBadge';
import StatusDropdown from './StatusDropdown';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { HiOutlineClipboardList } from 'react-icons/hi';

function EmptyOrderState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 float"
        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 0 30px rgba(99,102,241,0.1)' }}>
        <HiOutlineClipboardList className="w-8 h-8 text-primary-400" />
      </div>
      <h3 className="text-base font-bold text-dark-100 mb-2" style={{ fontFamily: "'Exo 2', sans-serif" }}>No Orders Yet</h3>
      <p className="text-sm text-dark-400 max-w-xs">Create your first order to start tracking your business.</p>
    </div>
  );
}

export default function OrderTable({ orders, onEdit, onDelete, onStatusChange, updatingId }) {
  if (!orders || orders.length === 0) return <EmptyOrderState />;

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
              {['Order #', 'Customer', 'Product', 'Qty', 'Amount', 'Status', 'Date', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3.5 text-[10px] font-bold text-dark-400 uppercase tracking-[2px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="table-row-hover" style={{ borderBottom: '1px solid rgba(99,102,241,0.05)' }}>
                <td className="px-4 py-4">
                  <span className="text-xs font-bold text-primary-400 font-mono tracking-wide"
                    style={{ textShadow: '0 0 10px rgba(99,102,241,0.5)' }}>
                    {order.orderNumber}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-white">{order.customerName}</p>
                  <p className="text-xs text-dark-400 mt-0.5">{order.phone}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-dark-100">{order.product}</p>
                  {order.size && <p className="text-xs text-dark-400 mt-0.5">Size: {order.size}</p>}
                </td>
                <td className="px-4 py-4 text-sm text-dark-200">{order.quantity}</td>
                <td className="px-4 py-4">
                  <span className="text-sm font-bold text-white">{formatCurrency(order.price * order.quantity)}</span>
                </td>
                <td className="px-4 py-4">
                  <StatusDropdown
                    currentStatus={order.status}
                    onStatusChange={(status) => onStatusChange(order._id, status)}
                    disabled={updatingId === order._id}
                  />
                </td>
                <td className="px-4 py-4 text-xs text-dark-400">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onEdit(order)}
                      className="p-2 rounded-lg text-dark-400 hover:text-primary-400 transition-all cursor-pointer"
                      style={{ ':hover': { background: 'rgba(99,102,241,0.1)' } }}>
                      <HiOutlinePencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(order)}
                      className="p-2 rounded-lg text-dark-400 hover:text-danger-400 transition-all cursor-pointer">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3 p-3">
        {orders.map((order) => (
          <div key={order._id} className="gradient-border p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-primary-400 font-mono">{order.orderNumber}</span>
                <p className="text-sm font-semibold text-white mt-0.5">{order.customerName}</p>
                <p className="text-xs text-dark-400">{order.phone}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-dark-200">{order.product}</p>
                <p className="text-xs text-dark-400">Qty: {order.quantity}{order.size ? ` · Size: ${order.size}` : ''}</p>
              </div>
              <p className="font-bold text-white">{formatCurrency(order.price * order.quantity)}</p>
            </div>
            <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
              <span className="text-xs text-dark-400">{formatDate(order.createdAt)}</span>
              <div className="flex items-center gap-2">
                <StatusDropdown currentStatus={order.status} onStatusChange={(s) => onStatusChange(order._id, s)} disabled={updatingId === order._id} />
                <button onClick={() => onEdit(order)} className="p-1.5 rounded-lg text-dark-400 hover:text-primary-400 transition-colors cursor-pointer">
                  <HiOutlinePencil className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(order)} className="p-1.5 rounded-lg text-dark-400 hover:text-danger-400 transition-colors cursor-pointer">
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
