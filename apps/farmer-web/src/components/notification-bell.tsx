"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Check, CheckCheck, X, MessageCircle, Package, Truck, AlertTriangle } from "lucide-react";
import { formatDateTime } from "@cultivator/utils";

interface Notification {
  id: string;
  type: string;
  channel: string;
  title: string;
  body: string;
  read: boolean;
  sent: boolean;
  createdAt: string;
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  order_confirmed: Package,
  delivery_update: Truck,
  low_stock: AlertTriangle,
  general: MessageCircle,
};

const typeColors: Record<string, string> = {
  order_confirmed: "bg-blue-50 text-blue-600",
  delivery_update: "bg-emerald-50 text-emerald-600",
  low_stock: "bg-amber-50 text-amber-600",
  general: "bg-slate-50 text-slate-600",
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem("cultivator-token");
      const res = await fetch("/api/notifications", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) setNotifications(data.data || []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (ids?: string[]) => {
    try {
      const token = localStorage.getItem("cultivator-token");
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: ids ? JSON.stringify({ ids }) : JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) =>
        ids
          ? prev.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n))
          : prev.map((n) => ({ ...n, read: true }))
      );
    } catch {}
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (!showDropdown) fetchNotifications();
        }}
        className="relative p-2 rounded-xl hover:bg-[var(--color-surface-muted)] transition-colors"
      >
        <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-light)]">
              <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAsRead()}
                  className="text-xs text-[var(--color-primary)] font-medium hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-2 opacity-40" />
                  <p className="text-sm text-[var(--color-text-muted)]">No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 20).map((n) => {
                  const Icon = typeIcons[n.type] || MessageCircle;
                  const colors = typeColors[n.type] || typeColors.general;
                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 p-4 border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-surface-muted)] transition-colors ${!n.read ? "bg-[var(--color-primary-50)]/30" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{n.title}</p>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">{n.body}</p>
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                          {formatDateTime(n.createdAt)}
                          {n.channel === "whatsapp" && " · WhatsApp"}
                        </p>
                      </div>
                      {!n.read && (
                        <button
                          onClick={() => markAsRead([n.id])}
                          className="p-1 rounded hover:bg-[var(--color-surface)] transition-colors flex-shrink-0"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
