import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Enterprise
  const enterprise = await prisma.enterprise.upsert({
    where: { id: "ent-001" },
    update: {},
    create: {
      id: "ent-001",
      name: "Cultivator Agriculture Pvt Ltd",
      phone: "+919876500000",
      email: "admin@cultivator.in",
      address: "Hyderabad, Telangana",
    },
  });
  console.log("Enterprise created:", enterprise.name);

  // Products
  const products = [
    { id: "prd-001", name: "Hybrid Rice Seeds", nameTe: "హైబ్రిడ్ రైస్ సీడ్స్", sku: "SED-001", category: "seeds", brand: "Bayer", brandTe: "బేయర్", description: "High-yield hybrid rice variety", descriptionTe: "అధిక దిగుబడి గల హైబ్రిడ్ రైస్ రకం", price: 450, unit: "kg", unitTe: "కేజీ", status: "active" },
    { id: "prd-002", name: "NPK Fertilizer 20:20:20", nameTe: "ఎన్‌పికే ఎరువు 20:20:20", sku: "FRT-001", category: "fertilizers", brand: "Coromandel", brandTe: "కోరోమండల్", description: "Balanced nutrient fertilizer", descriptionTe: "సమతుల్య పోషకాల ఎరువు", price: 380, unit: "bag", unitTe: "సంచులు", status: "active" },
    { id: "prd-003", name: "Neem Oil Pesticide", nameTe: "వేప నూనె పురుగుమందు", sku: "PST-001", category: "pesticides", brand: "Godrej", brandTe: "గోద్రెజ్", description: "Organic neem-based pesticide", descriptionTe: "సేంద్రియ వేప ఆధారిత పురుగుమందు", price: 280, unit: "ltr", unitTe: "లీటర్లు", status: "active" },
    { id: "prd-004", name: "Drip Irrigation Kit", nameTe: "డ్రిప్ ఇరిగేషన్ కిట్", sku: "IRG-001", category: "irrigation", brand: "Jain", brandTe: "జైన్", description: "Complete drip irrigation system for 1 acre", descriptionTe: "1 ఎకరం కోసం పూర్తి డ్రిప్ ఇరిగేషన్ వ్యవస్థ", price: 12500, unit: "kit", unitTe: "కిట్", status: "active" },
    { id: "prd-005", name: "Cotton Seeds BT", nameTe: "పత్తి విత్తనాలు BT", sku: "SED-002", category: "seeds", brand: "Monsanto", brandTe: "మొన్సాంటో", description: "Bt cotton seeds for pest resistance", descriptionTe: "పురుగు నిరోధక బిటి పత్తి విత్తనాలు", price: 890, unit: "kg", unitTe: "కేజీ", status: "active" },
    { id: "prd-006", name: "Urea Fertilizer", nameTe: "యూరియా ఎరువు", sku: "FRT-002", category: "fertilizers", brand: "NFL", brandTe: "ఎన్‌ఎఫ్‌ఎల్", description: "Nitrogen-rich urea fertilizer", descriptionTe: "నైట్రోజన్ సమృద్ధ యూరియా ఎరువు", price: 265, unit: "bag", unitTe: "సంచులు", status: "active" },
    { id: "prd-007", name: "Sprayer Machine 16L", nameTe: "స్ప్రేయర్ మషీన్ 16L", sku: "TOL-001", category: "farming_equipment", brand: "Kisan", brandTe: "కిసాన్", description: "Battery-operated sprayer", descriptionTe: "బ్యాటరీ ఆపరేటెడ్ స్ప్రేయర్", price: 3200, unit: "piece", unitTe: "ముక్క", status: "active" },
    { id: "prd-008", name: "Glyphosate Herbicide", nameTe: "గ్లైఫోసేట్ కలుపు మందు", sku: "PST-002", category: "crop_protection", brand: "Syngenta", brandTe: "సింజెంటా", description: "Broad-spectrum weed killer", descriptionTe: "విస్తృత శ్రేణి కలుపు నాశని", price: 520, unit: "ltr", unitTe: "లీటర్లు", status: "active" },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, enterpriseId: "ent-001" },
    });
  }
  console.log("Products seeded:", products.length);

  // Dealers
  const dealers = [
    { id: "dlr-001", name: "Sri Lakshmi Agro", nameTe: "శ్రీ లక్ష్మి ఆగ్రో", phone: "9876543210", email: "dealer@lakshmi.com", addressVillage: "Banswada", addressDistrict: "Kamareddy", addressState: "Telangana", addressPincode: "503187", addressFull: "Banswada, Kamareddy, Telangana 503187", locationLat: 18.3231, locationLng: 78.4015, serviceRadius: 15, description: "Premier agricultural supply dealer serving Kamareddy district", descriptionTe: "కామారెడ్డి జిల్లాకు సేవలందిస్తున్న ప్రధాన వ్యవసాయ సరఫరా డీలర్", totalOrders: 45, totalCustomers: 120, totalCalls: 200, rating: 4.5, status: "active" },
    { id: "dlr-002", name: "Venkateshwara Seeds", nameTe: "వెంకటేశ్వర సీడ్స్", phone: "9876543211", email: "dealer@venkateshwara.com", addressVillage: "Yellareddy", addressDistrict: "Nizamabad", addressState: "Telangana", addressPincode: "503231", addressFull: "Yellareddy, Nizamabad, Telangana 503231", locationLat: 18.5400, locationLng: 78.1100, serviceRadius: 12, description: "Leading seed supplier in Nizamabad", descriptionTe: "నిజామాబాద్‌లో ప్రముఖ విత్తన సరఫరాదారు", totalOrders: 38, totalCustomers: 95, totalCalls: 175, rating: 4.2, status: "active" },
    { id: "dlr-003", name: "Kamareddy Farm Inputs", nameTe: "కామారెడ్డి ఫార్మ్ ఇన్‌పుట్స్", phone: "9876543212", email: "dealer@kamareddyfarm.com", addressVillage: "Kamareddy", addressDistrict: "Kamareddy", addressState: "Telangana", addressPincode: "503111", addressFull: "Kamareddy, Kamareddy, Telangana 503111", locationLat: 18.3216, locationLng: 78.3340, serviceRadius: 20, description: "Complete farm solutions for Kamareddy area", descriptionTe: "కామారెడ్డి ప్రాంతంలో పూర్తి వ్యవసాయ పరిష్కారాలు", totalOrders: 52, totalCustomers: 140, totalCalls: 230, rating: 4.7, status: "active" },
    { id: "dlr-004", name: "Green Fields Agro", nameTe: "గ్రీన్ ఫీల్డ్స్ ఆగ్రో", phone: "9876543213", email: "dealer@greenfields.com", addressVillage: "Bodhan", addressDistrict: "Nizamabad", addressState: "Telangana", addressPincode: "503185", addressFull: "Bodhan, Nizamabad, Telangana 503185", locationLat: 18.6500, locationLng: 77.8800, serviceRadius: 10, description: "Trusted agro dealer in Bodhan", descriptionTe: "బోధన్‌లో నమ్మదగిన ఆగ్రో డీలర్", totalOrders: 28, totalCustomers: 75, totalCalls: 130, rating: 4.0, status: "active" },
    { id: "dlr-005", name: "Deccan Farm Solutions", nameTe: "దక్కన్ ఫార్మ్ సొల్యూషన్స్", phone: "9876543214", email: "dealer@deccanfarm.com", addressVillage: "Nizamabad", addressDistrict: "Nizamabad", addressState: "Telangana", addressPincode: "503001", addressFull: "Nizamabad, Nizamabad, Telangana 503001", locationLat: 18.6725, locationLng: 78.0940, serviceRadius: 18, description: "Comprehensive agricultural solutions provider", descriptionTe: "సమగ్ర వ్యవసాయ పరిష్కారాల అందజేయి", totalOrders: 41, totalCustomers: 110, totalCalls: 190, rating: 4.3, status: "active" },
    { id: "dlr-006", name: "Rythu Bazar Inputs", nameTe: "రైతు బజార్ ఇన్‌పుట్స్", phone: "9876543215", email: "dealer@rythubazar.com", addressVillage: "Banswada", addressDistrict: "Kamareddy", addressState: "Telangana", addressPincode: "503187", addressFull: "Banswada, Kamareddy, Telangana 503187", locationLat: 18.3400, locationLng: 78.4300, serviceRadius: 8, description: "Affordable farm inputs for small farmers", descriptionTe: "చిన్న రైతులకు సరసమైన వ్యవసాయ ఇన్‌పుట్లు", totalOrders: 22, totalCustomers: 65, totalCalls: 100, rating: 3.8, status: "active" },
  ];

  for (const d of dealers) {
    await prisma.dealer.upsert({
      where: { id: d.id },
      update: {},
      create: { ...d, enterpriseId: "ent-001" },
    });
  }
  console.log("Dealers seeded:", dealers.length);

  // Users
  const adminHash = await bcrypt.hash("admin123", 10);
  const dealerHash = await bcrypt.hash("dealer123", 10);

  await prisma.user.upsert({
    where: { id: "usr-admin" },
    update: {},
    create: { id: "usr-admin", email: "admin@cultivator.in", name: "Admin User", phone: "9999999999", passwordHash: adminHash, role: "enterprise_admin", enterpriseId: "ent-001" },
  });

  await prisma.user.upsert({
    where: { id: "usr-dealer" },
    update: {},
    create: { id: "usr-dealer", email: "dealer@lakshmi.com", name: "Sri Lakshmi Owner", phone: "9876543210", passwordHash: dealerHash, role: "dealer_owner", enterpriseId: "ent-001", dealerId: "dlr-001" },
  });
  console.log("Users seeded (admin + dealer)");

  // Farmers
  const farmers = [
    { id: "far-001", phone: "9000000001", name: "Rajesh Kumar", village: "Banswada", locationLat: 18.3300, locationLng: 78.4100 },
    { id: "far-002", phone: "9000000002", name: "Suresh Reddy", village: "Yellareddy", locationLat: 18.5500, locationLng: 78.1200 },
    { id: "far-003", phone: "9000000003", name: "Prasad", village: "Kamareddy", locationLat: 18.3250, locationLng: 78.3400 },
    { id: "far-004", phone: "9000000004", name: "Lakshmi Devi", village: "Bodhan", locationLat: 18.6600, locationLng: 78.8900 },
    { id: "far-005", phone: "9000000005", name: "Venkat", village: "Nizamabad", locationLat: 18.6800, locationLng: 78.1000 },
  ];

  for (const f of farmers) {
    await prisma.farmer.upsert({
      where: { id: f.id },
      update: {},
      create: f,
    });
  }
  console.log("Farmers seeded:", farmers.length);

  // Customers (farmer-dealer relationships)
  const customerData = [
    { id: "cust-001", dealerId: "dlr-001", farmerId: "far-001", name: "Rajesh Kumar", phone: "9000000001", village: "Banswada", totalOrders: 5, totalSpent: 12500 },
    { id: "cust-002", dealerId: "dlr-001", farmerId: "far-003", name: "Prasad", phone: "9000000003", village: "Kamareddy", totalOrders: 3, totalSpent: 8700 },
    { id: "cust-003", dealerId: "dlr-002", farmerId: "far-002", name: "Suresh Reddy", phone: "9000000002", village: "Yellareddy", totalOrders: 7, totalSpent: 21000 },
    { id: "cust-004", dealerId: "dlr-003", farmerId: "far-003", name: "Prasad", phone: "9000000003", village: "Kamareddy", totalOrders: 2, totalSpent: 5400 },
    { id: "cust-005", dealerId: "dlr-004", farmerId: "far-004", name: "Lakshmi Devi", phone: "9000000004", village: "Bodhan", totalOrders: 4, totalSpent: 9800 },
  ];

  for (const c of customerData) {
    await prisma.customer.upsert({
      where: { id: c.id },
      update: {},
      create: { ...c, totalOrders: c.totalOrders, totalSpent: c.totalSpent },
    });
  }
  console.log("Customers seeded:", customerData.length);

  // Inventory
  const inventoryData = [
    { dealerId: "dlr-001", productId: "prd-001", quantity: 50, price: 470, lowStockThreshold: 10 },
    { dealerId: "dlr-001", productId: "prd-002", quantity: 100, price: 400, lowStockThreshold: 15 },
    { dealerId: "dlr-001", productId: "prd-003", quantity: 30, price: 300, lowStockThreshold: 8 },
    { dealerId: "dlr-001", productId: "prd-006", quantity: 5, price: 280, lowStockThreshold: 10 },
    { dealerId: "dlr-002", productId: "prd-005", quantity: 25, price: 920, lowStockThreshold: 5 },
    { dealerId: "dlr-002", productId: "prd-001", quantity: 40, price: 460, lowStockThreshold: 10 },
    { dealerId: "dlr-003", productId: "prd-007", quantity: 15, price: 3400, lowStockThreshold: 3 },
    { dealerId: "dlr-003", productId: "prd-008", quantity: 0, price: 550, lowStockThreshold: 5 },
  ];

  for (const inv of inventoryData) {
    const existing = await prisma.inventory.findFirst({ where: { dealerId: inv.dealerId, productId: inv.productId } });
    if (!existing) {
      await prisma.inventory.create({ data: inv });
    }
  }
  console.log("Inventory seeded:", inventoryData.length);

  // Orders
  const orderData = [
    { id: "ord-001", dealerId: "dlr-001", customerId: "cust-001", subtotal: 2350, total: 2350, status: "confirmed", items: [{ productId: "prd-001", quantity: 5, unitPrice: 470, total: 2350 }] },
    { id: "ord-002", dealerId: "dlr-001", customerId: "cust-002", subtotal: 400, total: 400, status: "delivered", items: [{ productId: "prd-002", quantity: 1, unitPrice: 400, total: 400 }] },
    { id: "ord-003", dealerId: "dlr-002", customerId: "cust-003", subtotal: 4600, total: 4600, status: "new", items: [{ productId: "prd-005", quantity: 5, unitPrice: 920, total: 4600 }] },
  ];

  for (const o of orderData) {
    const existing = await prisma.order.findUnique({ where: { id: o.id } });
    if (!existing) {
      await prisma.order.create({
        data: {
          id: o.id, dealerId: o.dealerId, customerId: o.customerId, subtotal: o.subtotal, total: o.total, status: o.status,
          items: { create: o.items.map((i) => ({ ...i, orderId: o.id })) },
        },
      });
    }
  }
  console.log("Orders seeded:", orderData.length);

  // Calls
  const callData = [
    { dealerId: "dlr-001", farmerId: "far-001", customerId: "cust-001", farmerPhone: "9000000001", farmerName: "Rajesh Kumar", duration: 180, status: "completed", notes: "Inquiry about rice seeds" },
    { dealerId: "dlr-001", farmerId: "far-003", farmerPhone: "9000000003", farmerName: "Prasad", duration: 0, status: "missed" },
    { dealerId: "dlr-002", farmerId: "far-002", customerId: "cust-003", farmerPhone: "9000000002", farmerName: "Suresh Reddy", duration: 320, status: "completed", notes: "Bulk order discussion" },
  ];

  for (const c of callData) {
    const existing = await prisma.call.findFirst({ where: { farmerPhone: c.farmerPhone, dealerId: c.dealerId } });
    if (!existing) {
      await prisma.call.create({ data: c });
    }
  }
  console.log("Calls seeded:", callData.length);

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
