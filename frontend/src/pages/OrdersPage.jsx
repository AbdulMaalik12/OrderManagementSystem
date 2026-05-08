import { useState, useEffect, useCallback } from 'react';
import orderService from '../services/order.service';
import OrderTable from '../components/orders/OrderTable';
import OrderFilters from '../components/orders/OrderFilters';
import OrderForm from '../components/orders/OrderForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';
import { HiOutlinePlus } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);
  useEffect(() => { setPage(1); }, [statusFilter]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (debouncedSearch) params.search = debouncedSearch;
      const data = await orderService.getOrders(params);
      if (data.success) { setOrders(data.data.orders); setPagination(data.data.pagination); }
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleCreate = async (fd) => {
    setFormLoading(true);
    try {
      const data = await orderService.createOrder(fd);
      if (data.success) { toast.success('Order created!'); setModalOpen(false); fetchOrders(); }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create order'); }
    finally { setFormLoading(false); }
  };

  const handleUpdate = async (fd) => {
    setFormLoading(true);
    try {
      const data = await orderService.updateOrder(editingOrder._id, fd);
      if (data.success) { toast.success('Order updated!'); setModalOpen(false); setEditingOrder(null); fetchOrders(); }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update order'); }
    finally { setFormLoading(false); }
  };

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const data = await orderService.updateOrderStatus(orderId, status);
      if (data.success) {
        toast.success(`→ ${status}`);
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
      }
    } catch { toast.error('Failed to update status'); }
    finally { setUpdatingId(null); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const data = await orderService.deleteOrder(deleteConfirm._id);
      if (data.success) { toast.success('Order deleted'); setDeleteConfirm(null); fetchOrders(); }
    } catch { toast.error('Failed to delete order'); }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Exo 2', sans-serif" }}>Orders</h1>
          <p className="text-sm text-dark-400 mt-0.5">
            <span className="text-primary-400 font-bold">{pagination.totalOrders}</span> total order{pagination.totalOrders !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => { setEditingOrder(null); setModalOpen(true); }}>
          <HiOutlinePlus className="w-4 h-4 mr-1.5" />
          New Order
        </Button>
      </div>

      {/* Filters */}
      <OrderFilters search={search} onSearchChange={setSearch} status={statusFilter} onStatusChange={setStatusFilter} />

      {/* Table */}
      <div className="gradient-border overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-xs text-dark-400 tracking-widest uppercase">Loading orders...</p>
          </div>
        ) : (
          <>
            <OrderTable
              orders={orders} onEdit={(o) => { setEditingOrder(o); setModalOpen(true); }}
              onDelete={(o) => setDeleteConfirm(o)}
              onStatusChange={handleStatusChange} updatingId={updatingId}
            />
            <div style={{ borderTop: '1px solid rgba(99,102,241,0.08)' }}>
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingOrder(null); }}
        title={editingOrder ? '✏️ Edit Order' : '➕ New Order'} maxWidth="max-w-2xl">
        <OrderForm
          order={editingOrder}
          onSubmit={editingOrder ? handleUpdate : handleCreate}
          onCancel={() => { setModalOpen(false); setEditingOrder(null); }}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="⚠️ Delete Order">
        <div className="space-y-5">
          <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <p className="text-sm text-dark-200">
              Delete order <span className="font-bold text-primary-400">{deleteConfirm?.orderNumber}</span> for{' '}
              <span className="font-bold text-white">{deleteConfirm?.customerName}</span>?{' '}
              <span className="text-dark-400">This cannot be undone.</span>
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Order</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
