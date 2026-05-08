import { useState, useEffect } from 'react';
import orderService from '../services/order.service';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/orders/StatusBadge';
import Spinner from '../components/common/Spinner';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';
import {
  HiOutlineClipboardList, HiOutlineClock, HiOutlineTruck,
  HiOutlineCheckCircle, HiOutlineCurrencyDollar,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await orderService.getDashboardStats();
      if (data.success) { setStats(data.data.stats); setRecentOrders(data.data.recentOrders); }
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 float"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Spinner size="md" />
        </div>
        <p className="text-xs text-dark-400 tracking-widest uppercase">Loading Dashboard...</p>
      </div>
    </div>
  );

  const completionRate = stats?.totalOrders > 0
    ? Math.round(((stats?.deliveredOrders || 0) / stats.totalOrders) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            Dashboard
          </h1>
          <p className="text-sm text-dark-400 mt-0.5">Real-time business overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="w-2 h-2 rounded-full bg-success-400 pulse-dot" />
          <span className="text-xs font-semibold text-success-400">Live</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon={HiOutlineClipboardList} color="primary" />
        <StatCard title="Pending" value={stats?.pendingOrders || 0} icon={HiOutlineClock} color="warning" />
        <StatCard title="Delivered" value={stats?.deliveredOrders || 0} icon={HiOutlineCheckCircle} color="success" />
        <StatCard
          title="Total Revenue" value={formatCurrency(stats?.totalRevenue || 0)}
          icon={HiOutlineCurrencyDollar} color="violet"
          subtitle={`Collected: ${formatCurrency(stats?.deliveredRevenue || 0)}`}
        />
      </div>

      {/* Lower grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 gradient-border p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Exo 2', sans-serif" }}>
              Recent Orders
            </h2>
            <span className="text-[10px] text-dark-400 uppercase tracking-widest">Last 5</span>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-dark-400">No orders yet — create your first!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between py-3 table-row-hover rounded-lg px-3"
                  style={{ borderBottom: '1px solid rgba(99,102,241,0.06)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)' }}>
                      <HiOutlineTruck className="w-4 h-4 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{order.customerName}</p>
                      <p className="text-xs text-dark-400">{order.orderNumber} · {order.product}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-white">{formatCurrency(order.price * order.quantity)}</p>
                      <p className="text-xs text-dark-400">{formatRelativeTime(order.createdAt)}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status breakdown */}
        <div className="gradient-border p-5">
          <h2 className="text-base font-bold text-white mb-5" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            Status Breakdown
          </h2>
          <div className="space-y-3.5">
            {[
              { label: 'Pending',   count: stats?.pendingOrders   || 0, color: '#f59e0b' },
              { label: 'Confirmed', count: stats?.confirmedOrders || 0, color: '#6366f1' },
              { label: 'Shipped',   count: stats?.shippedOrders   || 0, color: '#8b5cf6' },
              { label: 'Delivered', count: stats?.deliveredOrders || 0, color: '#10b981' },
              { label: 'Cancelled', count: stats?.cancelledOrders || 0, color: '#ef4444' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
                  <span className="text-sm text-dark-200">{label}</span>
                </div>
                <span className="text-sm font-bold text-white">{count}</span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          {stats?.totalOrders > 0 && (
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-dark-300">Completion Rate</span>
                <span className="text-xs font-bold text-success-400">{completionRate}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden"
                style={{ background: 'rgba(99,102,241,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${completionRate}%`,
                    background: 'linear-gradient(90deg, #10b981, #34d399)',
                    boxShadow: '0 0 10px rgba(16,185,129,0.5)',
                  }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
