"use client";

import { useState } from "react";
import { useDeliveries } from "@cultivator/ui";
import { formatCurrency, formatDateTime } from "@cultivator/utils";
import { PageHeader, FilterTabs, StatusBadge } from "@cultivator/ui";
import { Plus, MapPin, User, Calendar, Truck, Navigation, Bike, Car } from "lucide-react";

const vehicleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  bike: Bike,
  auto: Car,
  car: Car,
  tractor: Truck,
  pickup: Truck,
  other: Truck,
};

const DEALER_ID = "dlr-001";

export default function DeliveriesPage() {
  const [filter, setFilter] = useState<string>("all");
  const { data: allDeliveries } = useDeliveries({ dealerId: DEALER_ID });
  const deliveries = allDeliveries || [];

  const filtered = filter === "all" ? deliveries : deliveries.filter((d: any) => d.status === filter);

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <PageHeader
        title="Deliveries"
        description={`${filtered.length} deliveries`}
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20">
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
        {filtered.map((delivery) => {
          const VehicleIcon = vehicleIcons[delivery.vehicle] || Truck;
          return (
            <div key={delivery.id} className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-5 hover-lift shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-[var(--color-text-primary)] text-lg">
                      {delivery.id.replace("del-", "Delivery #")}
                    </h3>
                    <StatusBadge status={delivery.status} />
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    {delivery.customerId.replace("cust-", "Customer ")}
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
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                    <Navigation className="w-3.5 h-3.5" />
                    Track
                  </button>
                  <select className="px-3 py-1.5 text-xs font-semibold bg-[var(--color-primary-50)] text-[var(--color-primary)] rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer">
                    <option value="">Update Status</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Mark Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
