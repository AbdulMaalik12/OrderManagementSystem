import { useState, useEffect } from 'react';
import orderService from '../services/order.service';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/orders/StatusBadge';
import Spinner from '../components/common/Spinner';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';
import {
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

/**
 * Dashboard page showing key metrics and recent orders.
 */
export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await orderService.getDashboardStats();
      if (data.success) {
        setStats(data.data.stats);
        setRecentOrders(data.data.recentOrders);
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-surface-800">Dashboard</h1>
        <p className="text-surface-500 text-sm mt-1">Overview of your business performance</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={HiOutlineClipboardList}
          color="primary"
        />
        <StatCard
          title="Pending"
          value={stats?.pendingOrders || 0}
          icon={HiOutlineClock}
          color="warning"
        />
        <StatCard
          title="Delivered"
          value={stats?.deliveredOrders || 0}
          icon={HiOutlineCheckCircle}
          color="success"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={HiOutlineCurrencyDollar}
          color="purple"
          subtitle={`Delivered: ${formatCurrency(stats?.deliveredRevenue || 0)}`}
        />
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-surface-200 p-5">
          <h2 className="text-lg font-semibold text-surface-800 mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-surface-400 py-8 text-center">No orders yet. Create your first order!</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between py-3 border-b border-surface-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center">
                      <HiOutlineTruck className="w-5 h-5 text-surface-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-800">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-surface-400">
                        {order.orderNumber} · {order.product}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-surface-800">
                        {formatCurrency(order.price * order.quantity)}
                      </p>
                      <p className="text-xs text-surface-400">
                        {formatRelativeTime(order.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order status breakdown */}
        <div className="bg-white rounded-xl border border-surface-200 p-5">
          <h2 className="text-lg font-semibold text-surface-800 mb-4">Status Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Pending', count: stats?.pendingOrders || 0, color: 'bg-warning-500' },
              { label: 'Confirmed', count: stats?.confirmedOrders || 0, color: 'bg-primary-500' },
              { label: 'Shipped', count: stats?.shippedOrders || 0, color: 'bg-purple-500' },
              { label: 'Delivered', count: stats?.deliveredOrders || 0, color: 'bg-success-500' },
              { label: 'Cancelled', count: stats?.cancelledOrders || 0, color: 'bg-danger-500' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="text-sm text-surface-600">{label}</span>
                </div>
                <span className="text-sm font-semibold text-surface-800">{count}</span>
              </div>
            ))}
          </div>

          {stats?.totalOrders > 0 && (
            <div className="mt-4 pt-4 border-t border-surface-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-surface-600">Completion Rate</span>
                <span className="text-sm font-bold text-success-600">
                  {Math.round(((stats?.deliveredOrders || 0) / stats.totalOrders) * 100)}%
                </span>
              </div>
              <div className="mt-2 h-2 bg-surface-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(((stats?.deliveredOrders || 0) / stats.totalOrders) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
