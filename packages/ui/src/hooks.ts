"use client";

import { useState, useEffect } from "react";

const API = "/api";

function useFetch<T>(url: string, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${API}${url}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success === false) {
          setError(json.error || "Request failed");
          setData(null);
        } else {
          setData(json.data ?? json);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) { setError(err.message); setData(null); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, deps);

  return { data, loading, error };
}

function buildQuery(params?: Record<string, string>) {
  if (!params) return "";
  const qs = new URLSearchParams(params).toString();
  return qs ? `?${qs}` : "";
}

export function useProducts(params?: Record<string, string>) {
  return useFetch<any[]>(`/products${buildQuery(params)}`, [JSON.stringify(params)]);
}

export function useDealers(params?: Record<string, string>) {
  return useFetch<any[]>(`/dealers${buildQuery(params)}`, [JSON.stringify(params)]);
}

export function useDealer(id: string) {
  return useFetch<any>(`/dealers/${id}`, [id]);
}

export function useOrders(params?: Record<string, string>) {
  return useFetch<any[]>(`/orders${buildQuery(params)}`, [JSON.stringify(params)]);
}

export function useInventory(params?: Record<string, string>) {
  return useFetch<any[]>(`/inventory${buildQuery(params)}`, [JSON.stringify(params)]);
}

export function useCustomers(params?: Record<string, string>) {
  return useFetch<any[]>(`/customers${buildQuery(params)}`, [JSON.stringify(params)]);
}

export function useDealerStats(id: string) {
  return useFetch<any>(`/dealers/${id}/stats`, [id]);
}

export function useAnalytics() {
  return useFetch<any>(`/analytics/enterprise`);
}

export function useDealerAnalytics(id: string) {
  return useFetch<any>(`/analytics/dealer/${id}`, [id]);
}

export function useCalls(params?: Record<string, string>) {
  return useFetch<any[]>(`/calls${buildQuery(params)}`, [JSON.stringify(params)]);
}

export function useDeliveries(params?: Record<string, string>) {
  return useFetch<any[]>(`/deliveries${buildQuery(params)}`, [JSON.stringify(params)]);
}
