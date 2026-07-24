export type DealerStatus = "active" | "inactive" | "pending" | "suspended";

export type OrderStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "delivery_assigned"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type CallStatus = "incoming" | "missed" | "completed" | "in_progress" | "cancelled";

export type DeliveryStatus =
  | "order_received"
  | "confirmed"
  | "preparing"
  | "delivery_assigned"
  | "out_for_delivery"
  | "delivered";

export type VehicleType = "bike" | "auto" | "car" | "tractor" | "pickup" | "other";

export type ProductCategory =
  | "seeds"
  | "fertilizers"
  | "pesticides"
  | "crop_protection"
  | "farming_equipment"
  | "tools"
  | "irrigation"
  | "organic"
  | "animal_feed";

export type UserRole =
  | "enterprise_admin"
  | "enterprise_manager"
  | "enterprise_support"
  | "dealer_owner"
  | "dealer_manager"
  | "dealer_sales"
  | "dealer_delivery";

export type Language = "en" | "te";

export interface Location {
  lat: number;
  lng: number;
}

export interface Address {
  village?: string;
  mandal?: string;
  district: string;
  state: string;
  pincode: string;
  full: string;
}

export interface OperatingHours {
  open: string;
  close: string;
}

export interface Dealer {
  id: string;
  enterpriseId: string;
  name: string;
  nameTe?: string;
  phone: string;
  email?: string;
  location: Location;
  address: Address;
  status: DealerStatus;
  serviceRadius: number;
  products: ProductCategory[];
  delivery: DeliveryCapability;
  operatingHours: OperatingHours;
  rating: number;
  totalOrders: number;
  totalCustomers: number;
  totalCalls: number;
  profileImage?: string;
  description?: string;
  descriptionTe?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryCapability {
  available: boolean;
  vehicles: VehicleType[];
  fee?: number;
  freeAbove?: number;
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  location?: Location;
  address?: Address;
  village?: string;
  preferredLanguage: Language;
  createdAt: string;
}

export interface Customer {
  id: string;
  dealerId: string;
  farmerId: string;
  name: string;
  phone: string;
  village?: string;
  address?: string;
  location?: Location;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  notes?: string;
  deliveryPreferences?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  enterpriseId: string;
  name: string;
  nameTe?: string;
  sku: string;
  category: ProductCategory;
  brand: string;
  brandTe?: string;
  description?: string;
  descriptionTe?: string;
  price: number;
  unit: string;
  unitTe?: string;
  imageUrl?: string;
  imageUploadedByDealer?: boolean;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  dealerId: string;
  productId: string;
  product?: Product;
  quantity: number;
  reserved: number;
  lowStockThreshold: number;
  price: number;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  dealerId: string;
  customerId: string;
  customer?: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  deliveryRequired: boolean;
  deliveryAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Call {
  id: string;
  dealerId: string;
  farmerPhone: string;
  farmerName?: string;
  customerId?: string;
  duration: number;
  status: CallStatus;
  notes?: string;
  followUpRequired: boolean;
  orderId?: string;
  createdAt: string;
}

export interface Delivery {
  id: string;
  dealerId: string;
  orderId: string;
  order?: Order;
  customerId: string;
  customer?: Customer;
  vehicle: VehicleType;
  driverName?: string;
  driverPhone?: string;
  deliveryAddress: string;
  deliveryFee: number;
  status: DeliveryStatus;
  scheduledAt?: string;
  deliveredAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enterprise {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalDealers: number;
  activeDealers: number;
  totalFarmers: number;
  createdAt: string;
}

export interface DashboardStats {
  totalDealers: number;
  activeDealers: number;
  totalFarmers: number;
  todayCalls: number;
  activeLeads: number;
  totalOrders: number;
  pendingDeliveries: number;
  todaySales: number;
}

export interface DealerDashboardStats {
  todayCalls: number;
  missedCalls: number;
  newLeads: number;
  pendingOrders: number;
  confirmedOrders: number;
  pendingDeliveries: number;
  lowStockProducts: number;
  todaySales: number;
  recentCustomers: Customer[];
}

export interface Activity {
  id: string;
  type: "call" | "order" | "delivery" | "lead" | "stock";
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
