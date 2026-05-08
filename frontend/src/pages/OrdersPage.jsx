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

/**
 * Orders management page with full CRUD, filtering, search, and pagination.
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when status filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (debouncedSearch) params.search = debouncedSearch;

      const data = await orderService.getOrders(params);
      if (data.success) {
        setOrders(data.data.orders);
        setPagination(data.data.pagination);
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Create order
  const handleCreate = async (formData) => {
    setFormLoading(true);
    try {
      const data = await orderService.createOrder(formData);
      if (data.success) {
        toast.success('Order created!');
        setModalOpen(false);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setFormLoading(false);
    }
  };

  // Update order
  const handleUpdate = async (formData) => {
    setFormLoading(true);
    try {
      const data = await orderService.updateOrder(editingOrder._id, formData);
      if (data.success) {
        toast.success('Order updated!');
        setModalOpen(false);
        setEditingOrder(null);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    } finally {
      setFormLoading(false);
    }
  };

  // Quick status change
  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const data = await orderService.updateOrderStatus(orderId, status);
      if (data.success) {
        toast.success(`Status updated to ${status}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status } : o))
        );
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete order
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const data = await orderService.deleteOrder(deleteConfirm._id);
      if (data.success) {
        toast.success('Order deleted');
        setDeleteConfirm(null);
        fetchOrders();
      }
    } catch (err) {
      toast.error('Failed to delete order');
    }
  };

  // Open edit modal
  const handleEdit = (order) => {
    setEditingOrder(order);
    setModalOpen(true);
  };

  // Open create modal
  const handleOpenCreate = () => {
    setEditingOrder(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-800">Orders</h1>
          <p className="text-surface-500 text-sm mt-0.5">
            {pagination.totalOrders} total order{pagination.totalOrders !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <HiOutlinePlus className="w-4 h-4 mr-1.5" />
          New Order
        </Button>
      </div>

      {/* Filters */}
      <OrderFilters
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Table */}
      <div className="bg-white rounded-xl border border-surface-200">
        {loading ? (
          <div className="py-16">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <OrderTable
              orders={orders}
              onEdit={handleEdit}
              onDelete={(order) => setDeleteConfirm(order)}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
            />
            <div className="border-t border-surface-100">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingOrder(null);
        }}
        title={editingOrder ? 'Edit Order' : 'New Order'}
        maxWidth="max-w-2xl"
      >
        <OrderForm
          order={editingOrder}
          onSubmit={editingOrder ? handleUpdate : handleCreate}
          onCancel={() => {
            setModalOpen(false);
            setEditingOrder(null);
          }}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Order"
      >
        <div className="space-y-4">
          <p className="text-sm text-surface-600">
            Are you sure you want to delete order{' '}
            <span className="font-semibold text-surface-800">
              {deleteConfirm?.orderNumber}
            </span>{' '}
            for{' '}
            <span className="font-semibold text-surface-800">
              {deleteConfirm?.customerName}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
