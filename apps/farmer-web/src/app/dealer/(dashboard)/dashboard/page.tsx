"use client";

import { useOrders, useInventory } from "@cultivator/ui";
import { formatCurrency, formatDateTime } from "@cultivator/utils";
import { StatCard, StatusBadge } from "@cultivator/ui";
import { Phone, Target, ShoppingCart, Truck, DollarSign, PhoneOff, CheckCircle, AlertTriangle, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

const DEALER_ID = "dlr-001";

export default function DealerDashboard() {
  const { data: orders } = useOrders({ dealerId: DEALER_ID });
  const { data: inventory } = useInventory({ dealerId: DEALER_ID });

  const orderList = (orders || []) as any[];
  const inventoryList = (inventory || []) as any[];

  const pendingOrders = orderList.filter((o: any) => ["new", "confirmed", "preparing"].includes(o.status)).length;
  const confirmedOrders = orderList.filter((o: any) => o.status === "confirmed").length;
  const todaySales = orderList.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const lowStockItems = inventoryList.filter((i: any) => i.quantity <= i.lowStockThreshold);

  const stats = {
    todayCalls: 12,
    newLeads: 4,
    pendingOrders,
    pendingDeliveries: 2,
    todaySales,
    missedCalls: 3,
    confirmedOrders,
    lowStockProducts: lowStockItems.length,
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Good Morning, Sri Lakshmi Agro
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Today's Calls" value={stats.todayCalls} icon={<Phone className="w-5 h-5" />} trend="12%" trendUp />
        <StatCard label="New Leads" value={stats.newLeads} icon={<Target className="w-5 h-5" />} trend="5%" trendUp variant="info" />
        <StatCard label="Pending Orders" value={stats.pendingOrders} icon={<ShoppingCart className="w-5 h-5" />} variant="warning" />
        <StatCard label="Pending Deliveries" value={stats.pendingDeliveries} icon={<Truck className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Today's Sales" value={formatCurrency(stats.todaySales)} icon={<DollarSign className="w-5 h-5" />} size="lg" variant="success" />
        <StatCard label="Missed Calls" value={stats.missedCalls} icon={<PhoneOff className="w-5 h-5" />} variant="error" />
        <StatCard label="Confirmed Orders" value={stats.confirmedOrders} icon={<CheckCircle className="w-5 h-5" />} variant="success" />
        <StatCard label="Low Stock" value={stats.lowStockProducts} icon={<AlertTriangle className="w-5 h-5" />} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[var(--color-text-primary)]">Low Stock Alert</h2>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              {lowStockItems.length} items
            </span>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-[var(--color-surface)] rounded-xl hover:bg-[var(--color-surface-muted)] transition-colors">
                <div>
                  <p className="text-sm font-semibold">{item.product?.name || "Product"}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {item.quantity} left &middot; {item.reserved} reserved
                  </p>
                </div>
                <StatusBadge status={item.quantity === 0 ? "out_of_stock" : "low"} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm">
          <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-5">Recent Activity</h2>
          <div className="space-y-3">
            {orderList.slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--color-surface)] transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-50)] flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Order #{order.id.slice(-3)}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{formatCurrency(order.total)} - {order.status}</p>
                </div>
                <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDateTime(order.createdAt).split(", ")[1] || ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">Recent Orders</h2>
          <Link href="/dealer/orders" className="flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border-light)]">
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Order</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Items</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {orderList.slice(0, 4).map((order: any) => (
                <tr key={order.id} className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-surface-hover)] transition-colors">
                  <td className="py-3 px-4 font-semibold">#{order.id.slice(-3)}</td>
                  <td className="py-3 px-4">{order.customerId?.slice(-3) || "N/A"}</td>
                  <td className="py-3 px-4">{order.items?.length || 0} item{(order.items?.length || 0) > 1 ? "s" : ""}</td>
                  <td className="py-3 px-4 font-bold text-[var(--color-primary)]">{formatCurrency(order.total)}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
