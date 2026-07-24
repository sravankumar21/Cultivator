"use client";

import { useState } from "react";
import { useProducts } from "@cultivator/ui";
import { ImageUpload } from "@cultivator/ui";
import { formatCurrency, getProductImage } from "@cultivator/utils";
import { SearchInput, StatusBadge, SectionHeader, LoadingPage, EmptyState, ErrorState } from "@cultivator/ui";
import { Search, ShoppingCart, Plus, Minus, X, Check, Wheat, FlaskConical, Shield, Package, Tractor, Wrench, Droplets, Leaf, Bug, RefreshCw, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@cultivator/ui/auth-context";

const categories = [
  { value: "all", label: "All" },
  { value: "seeds", label: "Seeds", icon: Wheat },
  { value: "fertilizers", label: "Fertilizers", icon: FlaskConical },
  { value: "pesticides", label: "Pesticides", icon: Shield },
  { value: "crop_protection", label: "Crop Protection", icon: Bug },
  { value: "farming_equipment", label: "Equipment", icon: Tractor },
  { value: "tools", label: "Tools", icon: Wrench },
  { value: "irrigation", label: "Irrigation", icon: Droplets },
  { value: "organic", label: "Organic", icon: Leaf },
];

const categoryColors: Record<string, string> = {
  seeds: "from-amber-50 to-amber-100/50 text-amber-600",
  fertilizers: "from-emerald-50 to-emerald-100/50 text-emerald-600",
  pesticides: "from-red-50 to-red-100/50 text-red-600",
  crop_protection: "from-orange-50 to-orange-100/50 text-orange-600",
  farming_equipment: "from-blue-50 to-blue-100/50 text-blue-600",
  tools: "from-purple-50 to-purple-100/50 text-purple-600",
  irrigation: "from-cyan-50 to-cyan-100/50 text-cyan-600",
  organic: "from-teal-50 to-teal-100/50 text-teal-600",
};

interface CartItem {
  product: any;
  quantity: number;
}

export default function ShopPage() {
  const { user } = useAuth();
  const DEALER_ID = user?.dealerId || "";
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [uploadingProduct, setUploadingProduct] = useState<any>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const { data: allProducts, loading, error } = useProducts();

  if (loading) return <LoadingPage message="Loading shop..." />;
  if (error) return <ErrorState description={error} action={<button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"><RefreshCw className="w-4 h-4" /> Retry</button>} />;

  const products = (allProducts || []).filter((p: any) => p.status === "active");

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`${product.name} added to order`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("cultivator-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      for (const item of cart) {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers,
          body: JSON.stringify({
            productId: item.product.id,
            quantity: item.quantity,
            dealerId: DEALER_ID,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }

      toast.success(`Order placed! ${cartCount} items totaling ${formatCurrency(cartTotal)}`);
      setCart([]);
      setShowCart(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleImageUpload = async (product: any, imageUrl: string | null) => {
    if (!imageUrl) return;
    try {
      const token = localStorage.getItem("cultivator-token");
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ imageUrl, imageUploadedByDealer: true }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Product image updated");
      setUploadingProduct(null);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to update image");
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Shop</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Browse enterprise products and place wholesale orders</p>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20"
        >
          <ShoppingCart className="w-4 h-4" />
          Order
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
                activeCategory === cat.value
                  ? "bg-[var(--color-primary)] text-white shadow-sm"
                  : "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border-light)] hover:border-[var(--color-primary-200)]"
              }`}
            >
              {cat.icon && <cat.icon className="w-4 h-4" />}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((product) => {
          const cat = categories.find((c) => c.value === product.category);
          const Icon = cat?.icon || Package;
          const colors = categoryColors[product.category] || "from-slate-50 to-slate-100/50 text-slate-600";
          const inCart = cart.find((item) => item.product.id === product.id);
          return (
            <div key={product.id} className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-5 hover-lift shadow-sm">
              {product.imageUrl ? (
                <div className="relative h-32 -mx-5 -mt-5 mb-4 rounded-t-2xl overflow-hidden">
                  <img src={getProductImage(product.imageUrl, product.category)} alt={product.name} className="w-full h-full object-cover" />
                  {product.imageUploadedByDealer && (
                    <span className="absolute top-2 right-2 text-[10px] font-medium bg-black/60 text-white px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Your photo
                    </span>
                  )}
                  <button
                    onClick={() => setUploadingProduct(product)}
                    className="absolute top-2 left-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors backdrop-blur-sm"
                    title="Change photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUploadingProduct(product)}
                      className="p-1.5 rounded-lg bg-[var(--color-surface-muted)] hover:bg-[var(--color-primary-50)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                      title="Upload product image"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-muted)] px-2 py-1 rounded-lg">
                      {product.sku}
                    </span>
                  </div>
                </div>
              )}
              <h3 className="font-bold text-[var(--color-text-primary)] mb-1">{product.name}</h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">{product.brand}</p>
              {product.description && (
                <p className="text-xs text-[var(--color-text-muted)] mb-4 line-clamp-2">{product.description}</p>
              )}
              {!product.description && <div className="mb-4" />}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-[var(--color-primary)]">{formatCurrency(product.price)}</span>
                  <span className="text-xs text-[var(--color-text-muted)] ml-1">/ {product.unit}</span>
                </div>
                {inCart ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="w-8 h-8 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-center hover:bg-[var(--color-border)] transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{inCart.quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-primary-light)] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <EmptyState icon={<Package className="w-8 h-8" />} title="No products found" description="No products match your current search or category" />
      )}

      {showCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="relative bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border)] shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-light)]">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Your Order</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-[var(--color-surface-muted)] rounded-lg transition-colors">
                <X className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-[var(--color-text-muted)]">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">Your order is empty</p>
                  <p className="text-sm mt-1">Add products to get started</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-xl">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{item.product.name}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{formatCurrency(item.product.price)} / {item.product.unit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-7 h-7 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-center hover:bg-[var(--color-border)] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-7 h-7 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-primary-light)] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-[var(--color-text-primary)] w-20 text-right">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[var(--color-border-light)] pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-[var(--color-text-muted)]">{cartCount} items</span>
                      <span className="text-xl font-bold text-[var(--color-primary)]">{formatCurrency(cartTotal)}</span>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20 disabled:opacity-50"
                    >
                      {placingOrder ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</> : <><Check className="w-4 h-4" /> Place Order</>}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {uploadingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setUploadingProduct(null)} />
          <div className="relative bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border)] shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Upload Product Image</h3>
              <button onClick={() => setUploadingProduct(null)} className="p-1 hover:bg-[var(--color-surface-muted)] rounded-lg transition-colors">
                <X className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Upload a photo for <strong>{uploadingProduct.name}</strong>
            </p>
            <ImageUpload
              onChange={(url) => handleImageUpload(uploadingProduct, url)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
