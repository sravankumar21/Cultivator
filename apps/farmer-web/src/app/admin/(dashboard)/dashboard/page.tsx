"use client";

import { useDealers, useProducts, useAnalytics } from "@cultivator/ui";
import { formatCurrency } from "@cultivator/utils";
import { StatCard, StatusBadge, LoadingPage, EmptyState, ErrorState } from "@cultivator/ui";
import { Store, Users, Phone, Target, ShoppingCart, Truck, DollarSign, ArrowRight, Star, Package, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: allDealers, loading: dealersLoading, error: dealersError } = useDealers();
  const { data: allProducts, loading: productsLoading, error: productsError } = useProducts();
  const { data: analyticsData, loading: analyticsLoading, error: analyticsError } = useAnalytics();
  const loading = dealersLoading || productsLoading || analyticsLoading;
  const error = dealersError || productsError || analyticsError;
  const dealers = (allDealers || []) as any[];
  const products = (allProducts || []) as any[];
  const stats = analyticsData || { totalDealers: dealers.length, activeDealers: dealers.filter((d: any) => d.status === "active").length, totalFarmers: 2340, todayCalls: 156, activeLeads: 89, totalOrders: 34, pendingDeliveries: 28, todaySales: 240000 };
  const activeDealers = dealers.filter((d: any) => d.status === "active");

  if (loading) return <LoadingPage message="Loading dashboard..." />;
  if (error) return <ErrorState description={error} action={<button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"><RefreshCw className="w-4 h-4" />Retry</button>} />;

  return (
    <div className="p-6 sm:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Network Overview
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Welcome back. Here&apos;s what&apos;s happening across your dealer network.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Dealers" value={stats.totalDealers} icon={<Store className="w-5 h-5" />} trend="3 this month" trendUp />
        <StatCard label="Active Dealers" value={stats.activeDealers} icon={<Users className="w-5 h-5" />} variant="success" />
        <StatCard label="Total Farmers" value={stats.totalFarmers.toLocaleString()} icon={<Users className="w-5 h-5" />} trend="120 this week" trendUp variant="info" />
        <StatCard label="Today's Calls" value={stats.todayCalls} icon={<Phone className="w-5 h-5" />} trend="12%" trendUp />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Leads" value={stats.activeLeads} icon={<Target className="w-5 h-5" />} />
        <StatCard label="Total Orders" value={stats.totalOrders} icon={<ShoppingCart className="w-5 h-5" />} variant="info" />
        <StatCard label="Pending Deliveries" value={stats.pendingDeliveries} icon={<Truck className="w-5 h-5" />} variant="warning" />
        <StatCard label="Today's Sales" value={formatCurrency(stats.todaySales)} icon={<DollarSign className="w-5 h-5" />} size="lg" variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm">
          <h2 className="text-base font-bold mb-5">Top Performing Dealers</h2>
          <div className="space-y-3">
            {activeDealers.length === 0 && (
              <EmptyState icon={<Store className="w-8 h-8" />} title="No active dealers" description="No active dealers found to display" />
            )}
            {activeDealers
              .sort((a, b) => b.totalOrders - a.totalOrders)
              .slice(0, 5)
              .map((dealer, i) => (
                <div key={dealer.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-surface)] transition-colors">
                  <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{dealer.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{dealer.address.village}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[var(--color-primary)]">
                      {formatCurrency(dealer.totalOrders * 150)}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">{dealer.totalOrders} orders</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm">
          <h2 className="text-base font-bold mb-5">Most Requested Products</h2>
          <div className="space-y-3">
            {products.length === 0 && (
              <EmptyState icon={<Package className="w-8 h-8" />} title="No products found" description="No products available to display" />
            )}
            {products.slice(0, 5).map((product: any) => (
              <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-surface)] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] flex items-center justify-center">
                  <Package className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{product.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{product.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrency(product.price)}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">per {product.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold">Dealer Network</h2>
          <Link href="/admin/dealers" className="flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-surface-muted)]">
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Dealer</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Products</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Orders</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody>
              {dealers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <EmptyState icon={<Store className="w-8 h-8" />} title="No dealers found" description="No dealers available in the network" />
                  </td>
                </tr>
              ) : dealers.slice(0, 6).map((dealer: any) => (
                <tr key={dealer.id} className="border-t border-[var(--color-border-light)] hover:bg-[var(--color-surface-hover)] transition-colors">
                  <td className="py-3 px-4 font-semibold">{dealer.name}</td>
                  <td className="py-3 px-4 text-[var(--color-text-muted)]">{dealer.address.village}, {dealer.address.district}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={dealer.status} />
                  </td>
                  <td className="py-3 px-4 text-[var(--color-text-muted)]">{dealer.products.length}</td>
                  <td className="py-3 px-4 font-bold">{dealer.totalOrders}</td>
                  <td className="py-3 px-4">
                    {dealer.rating > 0 ? (
                      <span className="flex items-center gap-1 font-semibold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {dealer.rating}
                      </span>
                    ) : "\u2014"}
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
