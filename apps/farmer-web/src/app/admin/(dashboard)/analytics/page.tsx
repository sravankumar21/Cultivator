"use client";

import { useDealers, useProducts, useOrders, useCalls } from "@cultivator/ui";
import { useAuth } from "@cultivator/ui/auth-context";
import { LoadingPage, EmptyState, ErrorState } from "@cultivator/ui";
import { TrendingUp, DollarSign, Phone, Target, Store, Users, ShoppingCart, BarChart3, RefreshCw } from "lucide-react";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { data: allDealers, loading: dealersLoading, error: dealersError } = useDealers();
  const { data: allProducts, loading: productsLoading, error: productsError } = useProducts();
  const { data: allOrders, loading: ordersLoading, error: ordersError } = useOrders();
  const { data: allCalls, loading: callsLoading, error: callsError } = useCalls();
  const loading = dealersLoading || productsLoading || ordersLoading || callsLoading;
  const error = dealersError || productsError || ordersError || callsError;
  const dealers = (allDealers || []) as any[];
  const products = (allProducts || []) as any[];
  const orders = (allOrders || []) as any[];
  const calls = (allCalls || []) as any[];

  if (!user || user.role !== "admin") {
    return <div className="p-8 text-center text-[var(--color-text-muted)]">Access denied. Admin only.</div>;
  }

  if (loading) return <LoadingPage message="Loading analytics..." />;
  if (error) return <ErrorState description={error} action={<button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"><RefreshCw className="w-4 h-4" />Retry</button>} />;

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const totalCalls = calls.length;
  const missedCalls = calls.filter((c: any) => c.status === "missed").length;
  const activeDealers = dealers.filter((d: any) => d.status === "active");
  const lowStockProducts = products.filter((p: any) => (p.stock ?? 999) < 10);

  const topDealers = [...dealers]
    .filter((d: any) => d.status === "active")
    .sort((a: any, b: any) => (b.totalOrders || 0) - (a.totalOrders || 0));

  const categoryCounts: Record<string, number> = {};
  products.forEach((p: any) => {
    const cat = p.category || "other";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const productCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1]);

  const districtCounts: Record<string, number> = {};
  dealers.forEach((d: any) => {
    const district = d.address?.district || "Unknown";
    districtCounts[district] = (districtCounts[district] || 0) + 1;
  });
  const districts = Object.entries(districtCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-6 sm:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Analytics</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Network performance and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm hover-lift">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)]">Total Revenue</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--color-primary)] tracking-tight">
            {totalRevenue > 0 ? `\u20B9${(totalRevenue / 1000).toFixed(1)}K` : "\u20B90"}
          </p>
          <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {orders.length} total orders
          </p>
        </div>
        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm hover-lift">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)]">Call Volume</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">{totalCalls.toLocaleString()}</p>
          <p className="text-xs font-semibold text-[var(--color-text-muted)] mt-2 flex items-center gap-1">
            {missedCalls} missed calls
          </p>
        </div>
        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm hover-lift">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)]">Low Stock Products</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--color-accent)] tracking-tight">{lowStockProducts.length}</p>
          <p className="text-xs font-semibold text-[var(--color-text-muted)] mt-2 flex items-center gap-1">
            {activeDealers.length} active dealers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm">
          <h2 className="text-base font-bold mb-5">Dealer Performance</h2>
          {topDealers.length === 0 ? (
            <EmptyState icon={<BarChart3 className="w-8 h-8" />} title="No dealer data" description="No dealer performance data available" />
          ) : (
          <div className="space-y-4">
            {topDealers.map((dealer, i) => {
              const maxOrders = topDealers[0]?.totalOrders || 1;
              const percentage = ((dealer.totalOrders || 0) / maxOrders) * 100;
              return (
                <div key={dealer.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{dealer.name}</span>
                    <span className="text-sm font-bold text-[var(--color-primary)]">
                      {dealer.totalOrders || 0} orders
                    </span>
                  </div>
                  <div className="h-2.5 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>

        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm">
          <h2 className="text-base font-bold mb-5">Product Categories</h2>
          {productCategories.length === 0 ? (
            <EmptyState icon={<BarChart3 className="w-8 h-8" />} title="No product data" description="No product demand data available" />
          ) : (
          <div className="space-y-4">
            {productCategories.map(([category, count]) => {
              const maxCount = productCategories[0][1];
              const percentage = (count / maxCount) * 100;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold capitalize">{category.replace(/_/g, " ")}</span>
                    <span className="text-sm text-[var(--color-text-muted)]">{count} products</span>
                  </div>
                  <div className="h-2.5 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>

      <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm">
        <h2 className="text-base font-bold mb-5">Geographic Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {districts.length === 0 ? (
            <div className="col-span-3">
              <EmptyState icon={<Store className="w-8 h-8" />} title="No location data" description="No dealer districts found" />
            </div>
          ) : districts.map(([district, count]) => {
            const districtDealers = dealers.filter((d: any) => d.address?.district === district);
            const districtOrders = districtDealers.reduce((sum: number, d: any) => sum + (d.totalOrders || 0), 0);
            const districtFarmers = districtDealers.reduce((sum: number, d: any) => sum + (d.totalCustomers || 0), 0);
            return (
              <div key={district} className="p-5 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border-light)]">
                <div className="flex items-center gap-2 mb-3">
                  <Store className="w-4 h-4 text-[var(--color-primary)]" />
                  <h3 className="text-sm font-bold">{district}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)] flex items-center gap-1.5"><Store className="w-3.5 h-3.5" /> Dealers</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)] flex items-center gap-1.5"><ShoppingCart className="w-3.5 h-3.5" /> Total Orders</span>
                    <span className="font-bold">{districtOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)] flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Farmers</span>
                    <span className="font-bold">{districtFarmers}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
