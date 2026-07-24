"use client";

import { useDealers, useProducts } from "@cultivator/ui";
import { formatCurrency } from "@cultivator/utils";
import { LoadingPage, EmptyState, ErrorState } from "@cultivator/ui";
import { TrendingUp, DollarSign, Phone, Target, Store, Users, ShoppingCart, BarChart3, RefreshCw } from "lucide-react";

export default function AnalyticsPage() {
  const { data: allDealers, loading: dealersLoading, error: dealersError } = useDealers();
  const { data: allProducts, loading: productsLoading, error: productsError } = useProducts();
  const loading = dealersLoading || productsLoading;
  const error = dealersError || productsError;
  const dealers = (allDealers || []) as any[];
  const products = (allProducts || []) as any[];

  if (loading) return <LoadingPage message="Loading analytics..." />;
  if (error) return <ErrorState description={error} action={<button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"><RefreshCw className="w-4 h-4" />Retry</button>} />;

  const topDealers = [...dealers]
    .filter((d: any) => d.status === "active")
    .sort((a: any, b: any) => b.totalOrders - a.totalOrders);

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
          <p className="text-3xl font-bold text-[var(--color-primary)] tracking-tight">&#8377;12.4L</p>
          <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            18% from last month
          </p>
        </div>
        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm hover-lift">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)]">Call Volume</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">4,830</p>
          <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            12% from last month
          </p>
        </div>
        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm hover-lift">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-sm font-medium text-[var(--color-text-muted)]">Lead Conversion</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--color-accent)] tracking-tight">34%</p>
          <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            5% from last month
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
              const percentage = (dealer.totalOrders / maxOrders) * 100;
              return (
                <div key={dealer.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{dealer.name}</span>
                    <span className="text-sm font-bold text-[var(--color-primary)]">
                      {formatCurrency(dealer.totalOrders * 150)}
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
          <h2 className="text-base font-bold mb-5">Product Demand</h2>
          {products.length === 0 ? (
            <EmptyState icon={<BarChart3 className="w-8 h-8" />} title="No product data" description="No product demand data available" />
          ) : (
          <div className="space-y-4">
            {products.slice(0, 6).map((product: any) => {
              const demand = Math.floor(Math.random() * 100) + 20;
              return (
                <div key={product.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{product.name}</span>
                    <span className="text-sm text-[var(--color-text-muted)]">{demand} orders</span>
                  </div>
                  <div className="h-2.5 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-700"
                      style={{ width: `${demand}%` }}
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
          {["Kamareddy", "Nizamabad", "Banswada"].map((district) => {
            const districtDealers = dealers.filter((d: any) => d.address?.district === district);
            return (
              <div key={district} className="p-5 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border-light)]">
                <div className="flex items-center gap-2 mb-3">
                  <Store className="w-4 h-4 text-[var(--color-primary)]" />
                  <h3 className="text-sm font-bold">{district}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)] flex items-center gap-1.5"><Store className="w-3.5 h-3.5" /> Dealers</span>
                    <span className="font-bold">{districtDealers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)] flex items-center gap-1.5"><ShoppingCart className="w-3.5 h-3.5" /> Total Orders</span>
                    <span className="font-bold">
                      {districtDealers.reduce((sum, d) => sum + d.totalOrders, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)] flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Farmers</span>
                    <span className="font-bold">
                      {districtDealers.reduce((sum, d) => sum + d.totalCustomers, 0)}
                    </span>
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
