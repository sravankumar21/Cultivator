"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, Truck, CheckCircle, Clock, Camera, X } from "lucide-react";
import { formatDateTime } from "@cultivator/utils";
import { ImageUpload } from "./image-upload";

interface TrackingPoint {
  id: string;
  driverLat: number;
  driverLng: number;
  speed: number | null;
  heading: number | null;
  timestamp: string;
}

interface DeliveryProof {
  imageUrl: string;
  signature: string | null;
  notes: string | null;
  capturedAt: string;
}

interface TrackingMapProps {
  deliveryId: string;
  status: string;
  driverName?: string;
  deliveryAddress: string;
  isDealer?: boolean;
}

export function TrackingMap({ deliveryId, status, driverName, deliveryAddress, isDealer }: TrackingMapProps) {
  const [tracking, setTracking] = useState<TrackingPoint[]>([]);
  const [proof, setProof] = useState<DeliveryProof | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProofForm, setShowProofForm] = useState(false);

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [deliveryId]);

  const fetchTracking = async () => {
    try {
      const token = localStorage.getItem("cultivator-token");
      const res = await fetch(`/api/deliveries/${deliveryId}/track`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setTracking(data.data.tracking || []);
        setProof(data.data.proof || null);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const latestPoint = tracking[tracking.length - 1];

  const statusSteps = [
    { key: "delivery_assigned", label: "Assigned", icon: Truck },
    { key: "out_for_delivery", label: "In Transit", icon: Navigation },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === status);

  return (
    <div className="space-y-6">
      {/* Status Timeline */}
      <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-5">
        <h3 className="font-bold text-[var(--color-text-primary)] mb-4">Delivery Status</h3>
        <div className="flex items-center justify-between">
          {statusSteps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i <= currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/25"
                    : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
                } ${isCurrent ? "ring-4 ring-[var(--color-primary-50)]" : ""}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"}`}>
                  {step.label}
                </span>
                {i < statusSteps.length - 1 && (
                  <div className={`absolute w-full h-0.5 top-5 ${isActive ? "bg-[var(--color-primary)]" : "bg-[var(--color-surface-muted)]"}`}
                    style={{ left: "50%", width: "calc(100% - 60px)", zIndex: -1 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Location */}
      {status === "out_for_delivery" && (
        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--color-text-primary)]">Live Tracking</h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </div>
          </div>

          {loading ? (
            <div className="h-32 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : latestPoint ? (
            <div className="space-y-4">
              {/* Map placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-[var(--color-border-light)] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-1 animate-bounce" />
                    <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                      {latestPoint.driverLat.toFixed(4)}, {latestPoint.driverLng.toFixed(4)}
                    </p>
                  </div>
                </div>
                {tracking.length > 1 && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                    <polyline
                      points={tracking.map((p, i) => {
                        const x = 20 + (i / (tracking.length - 1)) * 360;
                        const y = 100 + (p.driverLat - tracking[0].driverLat) * 1000;
                        return `${x},${Math.max(10, Math.min(190, y))}`;
                      }).join(" ")}
                      fill="none"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="2"
                      strokeDasharray="4"
                    />
                  </svg>
                )}
              </div>

              {/* Tracking info */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-[var(--color-surface)] rounded-xl">
                  <p className="text-[10px] text-[var(--color-text-muted)] mb-0.5">Speed</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">
                    {latestPoint.speed ? `${Math.round(latestPoint.speed)} km/h` : "—"}
                  </p>
                </div>
                <div className="text-center p-3 bg-[var(--color-surface)] rounded-xl">
                  <p className="text-[10px] text-[var(--color-text-muted)] mb-0.5">Updates</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">{tracking.length}</p>
                </div>
                <div className="text-center p-3 bg-[var(--color-surface)] rounded-xl">
                  <p className="text-[10px] text-[var(--color-text-muted)] mb-0.5">Last Update</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">
                    {formatDateTime(latestPoint.timestamp).split(", ")[1]}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-sm text-[var(--color-text-muted)]">
              <Navigation className="w-4 h-4 mr-2 opacity-50" />
              Waiting for driver location updates...
            </div>
          )}
        </div>
      )}

      {/* Delivery Proof */}
      {status === "delivered" && !proof && isDealer && (
        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--color-text-primary)]">Delivery Proof</h3>
            {!showProofForm && (
              <button
                onClick={() => setShowProofForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[var(--color-primary)] text-white rounded-lg"
              >
                <Camera className="w-3.5 h-3.5" />
                Add Proof
              </button>
            )}
          </div>

          {showProofForm ? (
            <ProofForm deliveryId={deliveryId} onSubmit={() => { setShowProofForm(false); fetchTracking(); }} />
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">No delivery proof captured yet.</p>
          )}
        </div>
      )}

      {proof && (
        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-5">
          <h3 className="font-bold text-[var(--color-text-primary)] mb-3">Delivery Proof</h3>
          <div className="relative rounded-xl overflow-hidden mb-3">
            <img src={proof.imageUrl} alt="Delivery proof" className="w-full h-48 object-cover" />
          </div>
          {proof.signature && (
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">
              <strong>Signed:</strong> {proof.signature}
            </p>
          )}
          {proof.notes && (
            <p className="text-sm text-[var(--color-text-muted)]">{proof.notes}</p>
          )}
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            Captured {formatDateTime(proof.capturedAt)}
          </p>
        </div>
      )}

      {/* Driver Info */}
      {driverName && (
        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center">
              <Truck className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{driverName}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Driver</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProofForm({ deliveryId, onSubmit }: { deliveryId: string; onSubmit: () => void }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!imageUrl) { setError("Please upload a photo"); return; }
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("cultivator-token");
      const res = await fetch(`/api/deliveries/${deliveryId}/proof`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ imageUrl, notes }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      onSubmit();
    } catch (err: any) {
      setError(err.message || "Failed to save proof");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <ImageUpload onChange={setImageUrl} />
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional notes (e.g., left at door)"
        className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={saving || !imageUrl}
        className="w-full h-10 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Submit Proof"}
      </button>
    </div>
  );
}
