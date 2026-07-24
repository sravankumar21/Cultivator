"use client";

import { useState, useCallback } from "react";
import { useDeliveries, useOrders } from "@cultivator/ui";
import { formatCurrency, formatDateTime } from "@cultivator/utils";
import { PageHeader, FilterTabs, StatusBadge, Modal, LoadingPage, EmptyState, ErrorState } from "@cultivator/ui";
import { Plus, MapPin, User, Calendar, Truck, Navigation, Bike, Car, X, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@cultivator/ui/auth-context";
import { TrackingMap } from "@cultivator/ui";
import { toast } from "sonner";

const vehicleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  bike: Bike, auto: Car, car: Car, tractor: Truck, pickup: Truck, other: Truck,
};

export default function DeliveriesPage() {
  const { user } = useAuth();
  const DEALER_ID = user?.dealerId || "";
  const [filter, setFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const { data: allDeliveries, loading, error } = useDeliveries({ dealerId: DEALER_ID });
  const { data: allOrders } = useOrders({ dealerId: DEALER_ID });
  const deliveries = allDeliveries || [];
  const orders = (allOrders || []) as any[];

  const filtered = filter === "all" ? deliveries : deliveries.filter((d: any) => d.status === filter);

  const handleStatusUpdate = async (deliveryId: string, newStatus: string) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("cultivator-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`/api/deliveries/${deliveryId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(`Delivery ${newStatus === "delivered" ? "marked as delivered" : "updated"}`);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to update delivery");
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      {loading && <LoadingPage message="Loading deliveries..." />}
      {error && <ErrorState description={error} action={<button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"><RefreshCw className="w-4 h-4" /> Retry</button>} />}

      {!loading && !error && (
      <>
      <PageHeader
        title="Deliveries"
        description={`${filtered.length} deliveries`}
        action={
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20">
            <Plus className="w-4 h-4" />
            Create Delivery
          </button>
        }
      />

      <div className="mb-6">
        <FilterTabs
          value={filter as "all" | "delivery_assigned" | "out_for_delivery" | "delivered"}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: deliveries.length },
            { value: "delivery_assigned", label: "Assigned" },
            { value: "out_for_delivery", label: "In Transit" },
            { value: "delivered", label: "Delivered" },
          ]}
        />
      </div>

      <div className="space-y-4">
        {filtered.map((delivery: any) => {
          const VehicleIcon = vehicleIcons[delivery.vehicle] || Truck;
          return (
            <div key={delivery.id} className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-5 hover-lift shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-[var(--color-text-primary)] text-lg">Delivery #{delivery.id.slice(-6)}</h3>
                    <StatusBadge status={delivery.status} />
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    {delivery.customer?.name || "Customer"}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-lg font-bold text-[var(--color-primary)]">
                    {delivery.deliveryFee > 0 ? formatCurrency(delivery.deliveryFee) : "Free"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-[var(--color-surface)] rounded-xl">
                <div className="flex items-center gap-2">
                  <VehicleIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Vehicle</p>
                    <p className="text-sm font-semibold capitalize">{delivery.vehicle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Driver</p>
                    <p className="text-sm font-semibold">{delivery.driverName || "\u2014"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Destination</p>
                    <p className="text-sm font-semibold truncate max-w-[150px]">{delivery.deliveryAddress || "\u2014"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Scheduled</p>
                    <p className="text-sm font-semibold">
                      {delivery.scheduledAt ? formatDateTime(delivery.scheduledAt).split(", ")[0] : "ASAP"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-light)]">
                <p className="text-xs text-[var(--color-text-muted)]">
                  {formatDateTime(delivery.createdAt).split(", ").slice(1).join(", ")}
                </p>
                <div className="flex gap-2">
                  {["out_for_delivery", "delivery_assigned"].includes(delivery.status) && (
                    <button onClick={() => setSelectedDelivery(delivery)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      <Navigation className="w-3.5 h-3.5" />
                      Track
                    </button>
                  )}
                  {delivery.status === "out_for_delivery" && (
                    <button onClick={() => handleStatusUpdate(delivery.id, "delivered")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">
                      Mark Delivered
                    </button>
                  )}
                  {delivery.status === "delivery_assigned" && (
                    <button onClick={() => handleStatusUpdate(delivery.id, "out_for_delivery")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[var(--color-primary-50)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-100)] transition-colors">
                      <Navigation className="w-3.5 h-3.5" />
                      Out for Delivery
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <EmptyState icon={<Truck className="w-8 h-8" />} title="No deliveries found" description="No deliveries match your current filter" />
      )}

      {showCreate && <CreateDeliveryModal orders={orders} dealerId={DEALER_ID} onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); window.location.reload(); }} />}

      {selectedDelivery && (
        <Modal open onClose={() => setSelectedDelivery(null)}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Track Delivery #{selectedDelivery.id.slice(-6)}</h2>
            <button onClick={() => setSelectedDelivery(null)} className="p-1 rounded-lg hover:bg-[var(--color-surface-muted)]"><X className="w-5 h-5" /></button>
          </div>
          <TrackingMap
            deliveryId={selectedDelivery.id}
            status={selectedDelivery.status}
            driverName={selectedDelivery.driverName}
            deliveryAddress={selectedDelivery.deliveryAddress}
            isDealer
          />
        </Modal>
      )}
      </>
      )}
    </div>
  );
}

function CreateDeliveryModal({ orders, dealerId, onClose, onCreated }: { orders: any[]; dealerId: string; onClose: () => void; onCreated: () => void }) {
  const [orderId, setOrderId] = useState("");
  const [vehicle, setVehicle] = useState("bike");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const eligibleOrders = orders.filter((o: any) => !["delivered", "cancelled"].includes(o.status));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) { setError("Select an order"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(typeof window !== "undefined" && localStorage.getItem("cultivator-token")
            ? { Authorization: `Bearer ${localStorage.getItem("cultivator-token")}` }
            : {}),
        },
        body: JSON.stringify({
          orderId, vehicle, driverName: driverName || undefined,
          driverPhone: driverPhone || undefined,
          deliveryAddress: deliveryAddress || undefined,
          deliveryFee: deliveryFee ? parseFloat(deliveryFee) : 0,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Delivery created");
      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create delivery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Create Delivery</h2>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--color-surface-muted)]"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Order *</label>
          <select value={orderId} onChange={(e) => setOrderId(e.target.value)}
            className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
            <option value="">Select order</option>
            {eligibleOrders.map((o: any) => (
              <option key={o.id} value={o.id}>#{o.id.slice(-6)} — {o.customer?.name || "Customer"} — {formatCurrency(o.total)}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Vehicle</label>
            <select value={vehicle} onChange={(e) => setVehicle(e.target.value)}
              className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
              <option value="bike">Bike</option>
              <option value="auto">Auto</option>
              <option value="car">Car</option>
              <option value="tractor">Tractor</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Delivery Fee</label>
            <input type="number" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)}
              placeholder="0" className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Driver Name</label>
            <input type="text" value={driverName} onChange={(e) => setDriverName(e.target.value)}
              placeholder="Driver name" className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Driver Phone</label>
            <input type="tel" value={driverPhone} onChange={(e) => setDriverPhone(e.target.value)}
              placeholder="Phone number" className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Delivery Address</label>
          <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Delivery address" className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading || !orderId}
          className="w-full h-11 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "Create Delivery"}
        </button>
      </form>
    </Modal>
  );
}
